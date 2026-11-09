# SSL-сертификат chessboxingfit.com: продление

Сертификат выпускается в Namecheap (Standard SSL, CA — SSL.com, SSL ID 36124766). Подписка оплачена на 2 года, но **один сертификат живёт максимум 200 дней**. Поэтому примерно раз в полгода нужно делать **Reissue** по этой инструкции.

| Выпуск | Истекает | Следующий Reissue |
|---|---|---|
| 30.09.2026 | ~апрель 2027 (точная дата — команда в шаге 5) | начать в **марте 2027** |

Namecheap присылает напоминание за 30 дней до конца. Не жди, пока сертификат истечёт: сайт сразу перестанет открываться.

## Как это устроено

- VM: `instance-warsaw-chessbox`, зона `europe-central2-c`. Подключение: `npm run connect`.
- Nginx в контейнере `gateway` берёт файлы с хоста (volume в [docker-compose.yaml](docker-compose.yaml), пути в [gateway/nginx/nginx.tmp.ssl.conf](gateway/nginx/nginx.tmp.ssl.conf)):
  - `/etc/ssl/chessboxingfit/fullchain.crt`: сертификат + цепочка
  - `/etc/ssl/chessboxingfit/chessboxingfit.key`: приватный ключ
- Ключ и CSR лежат на VM в `~/ssl-2026/` (`chessboxingfit.key`, `chessboxingfit.csr`). Ключ никому не отправлять и не удалять. Для Reissue подходит тот же CSR, новый делать не нужно.

Пересобирать Docker-образы не нужно, достаточно заменить файлы и перезагрузить nginx.

---

## Шаг 1. Namecheap: Reissue

1. Namecheap → Account → Product List → SSL Certificates → Standard SSL for chessboxingfit.com → **Reissue**.
2. Если появится окно про 200 дней и автоматизацию, нажать **Continue manually**.
3. В поле **CSR** вставить содержимое CSR с VM:
   ```bash
   cat ~/ssl-2026/chessboxingfit.csr
   ```
   Скопировать целиком, вместе со строками `-----BEGIN/END CERTIFICATE REQUEST-----`. Primary domain: `chessboxingfit.com`.
4. DCV-метод: **DNS / CNAME**. Server type: Nginx (или Other). Указать email, на него придёт сертификат.
5. Submit.

> Если CSR потерялся, создать новый ключ и CSR на VM:
> ```bash
> mkdir -p ~/ssl-2026 && cd ~/ssl-2026
> openssl req -new -newkey rsa:2048 -nodes \
>   -keyout chessboxingfit.key -out chessboxingfit.csr \
>   -subj "/C=US/CN=chessboxingfit.com"
> chmod 600 chessboxingfit.key
> ```

## Шаг 2. CNAME для проверки домена

Namecheap покажет **Host** и **Value** (`dcv.ssl.com`). Возможно, запись с прошлого раза ещё осталась. Тогда сравнить Host: если совпадает, ничего не делать.

Domain List → chessboxingfit.com → **Advanced DNS** → Add New Record:

| Type | Host | Value | TTL |
|---|---|---|---|
| CNAME Record | Host **без** `.chessboxingfit.com` на конце (обычно начинается с `_`) | `dcv.ssl.com` | Automatic |

Если Host пустой или `@`, CNAME **не создавать**: запись на корень домена сломает сайт.

Проверка (с Mac, через 5–10 минут):
```bash
dig CNAME <host>.chessboxingfit.com +short   # → dcv.ssl.com.
```

Ждать статус **Issued** (от 15 минут до пары часов), потом нажать **Download**. В архиве будут `chessboxingfit_com.crt` и `chessboxingfit_com.ca-bundle`.

## Шаг 3. Загрузить сертификат на VM (с Mac)

```bash
cd ~/Downloads/<распакованный архив>
gcloud compute scp chessboxingfit_com.crt chessboxingfit_com.ca-bundle \
  instance-warsaw-chessbox:~/ssl-2026/ --zone europe-central2-c
```

## Шаг 4. Проверить, собрать, установить (на VM)

```bash
npm run connect   # или: gcloud compute ssh instance-warsaw-chessbox --zone europe-central2-c
cd ~/ssl-2026

# 1. ключ и сертификат совпадают? Хеши должны быть одинаковыми, иначе дальше не идти
openssl x509 -noout -modulus -in chessboxingfit_com.crt | openssl md5
openssl rsa  -noout -modulus -in chessboxingfit.key      | openssl md5

# 2. собрать fullchain.
#    ВАЖНО: не делать просто `cat a b > fullchain`. У файла от Namecheap нет перевода
#    строки в конце, END и BEGIN склеятся, и nginx упадёт с ошибкой "bad end line".
{ cat chessboxingfit_com.crt; echo; cat chessboxingfit_com.ca-bundle; echo; } \
  | tr -d '\r' | sed '/^$/d' > fullchain.crt

# 3. проверить fullchain: BEGIN и END каждый на своей строке, парами
grep -n -- '-----' fullchain.crt
openssl x509 -noout -subject -dates -in fullchain.crt

# 4. бэкап текущих файлов
sudo cp -a /etc/ssl/chessboxingfit /etc/ssl/chessboxingfit.bak-$(date +%F)

# 5. установить
sudo cp fullchain.crt                /etc/ssl/chessboxingfit/fullchain.crt
sudo cp chessboxingfit.key           /etc/ssl/chessboxingfit/chessboxingfit.key
sudo cp chessboxingfit_com.crt       /etc/ssl/chessboxingfit/chessboxingfit.crt
sudo cp chessboxingfit_com.ca-bundle /etc/ssl/chessboxingfit/chessboxingfit.ca-bundle
sudo chmod 644 /etc/ssl/chessboxingfit/*.crt /etc/ssl/chessboxingfit/*.ca-bundle
sudo chmod 600 /etc/ssl/chessboxingfit/chessboxingfit.key

# 6. проверить конфиг и перезагрузить nginx
GW=$(docker ps --format '{{.Names}}' | grep gateway)
docker exec $GW nginx -t && docker exec $GW nginx -s reload
```

Если `nginx -t` падает, reload не выполнится и сайт продолжит работать на старых файлах. Разобраться с ошибкой, а если нужно откатиться, вернуть файлы из `/etc/ssl/chessboxingfit.bak-<дата>`.

## Шаг 5. Проверка

```bash
echo | openssl s_client -connect chessboxingfit.com:443 -servername chessboxingfit.com 2>/dev/null \
  | openssl x509 -noout -dates -issuer
```

- `notAfter`: примерно через 200 дней. **Записать эту дату в таблицу вверху** и поставить напоминание за месяц до неё.
- Открыть https://chessboxingfit.com и https://www.chessboxingfit.com в режиме инкогнито.
- https://www.ssllabs.com/ssltest/: не должно быть «chain incomplete».

## Частые ошибки

| Ошибка | Причина | Решение |
|---|---|---|
| `PEM routines::bad end line` | `END` и `BEGIN` склеились при сборке fullchain | собрать fullchain командой из шага 4.2 |
| `key values mismatch` / хеши в шаге 4.1 разные | сертификат выпущен по другому CSR | сделать Reissue с `~/ssl-2026/chessboxingfit.csr` |
| Браузер пишет «certificate not trusted» / chain incomplete | в fullchain нет ca-bundle | сначала `.crt`, потом `.ca-bundle` |
| DCV не проходит | CNAME ещё не применился или Host указан с доменом на конце | проверить `dig`, в Host не должно быть `.chessboxingfit.com` |

## Потом, по желанию

Чтобы не повторять всё это вручную каждые полгода, можно настроить автоматическое продление через ACME (Namecheap → «Choose automation», клиент acme.sh на VM).
