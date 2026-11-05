# Deployment guide

This guide puts Lemonade on the internet. It is written for someone who has not deployed a Laravel or
Next.js app before. Follow one section for the backend and one for the frontends. You do not need to read
the others.

## What you are deploying

Lemonade is three small programs that talk to each other.

| Part | What it is | Repository | Needs |
| ---- | ---------- | ---------- | ----- |
| **Backend** | The API. It holds the data and all the rules. | `lemonade-backend` | PHP 8.3, MySQL 8 |
| **User app** | The website people use. | `lemonade-web`, `apps/frontend` (name `lemonade-app`) | Node 22 |
| **Admin app** | The console for your team. | `lemonade-web`, `apps/admin` (name `lemonade-admin`) | Node 22 |

Each part needs the address of the others: the backend needs the two app addresses (`FRONTEND_URL` and
`ADMIN_URL`), and the two apps need the backend address. This is not a trap. An address exists as soon as
you create an app (on Heroku) or choose a name (on your own domain), long before anything is deployed. So:
**decide or create all three addresses first, set the values everywhere, then deploy** the backend, then
the user app, then the admin app.

The step-by-step guide for the two apps is in [`FRONTEND-DEPLOYMENT.md`](./FRONTEND-DEPLOYMENT.md).

You will end up with three web addresses, for example:

- `https://api.example.com` (backend)
- `https://app.example.com` (user app)
- `https://admin.example.com` (admin app)

## Before you start

Make a list of these. You will paste them in later.

1. **A domain name**, or three subdomains of one.
2. **A MySQL 8 database.** Every host below can give you one.
3. **Paystack keys** (Settings, API Keys). Use test keys first, live keys when you are ready.
4. **Cloudinary account** (cloud name, API key, API secret). Pictures and videos are stored here. This is
   needed on Heroku and recommended everywhere, because the user and admin apps only show pictures from
   Cloudinary or DigitalOcean Spaces.
5. **Resend account** (an API key) to send emails.
6. **Optional:** a Firebase project for push notifications, and a Google sign-in client ID.

## The values you will set

An environment value is a named setting you give to the host instead of writing it in code. Every host
below has a place to paste them.

### Backend

| Name | What to put |
| ---- | ----------- |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | Run `php artisan key:generate --show` once on your computer and paste the result. |
| `APP_URL` | `https://api.example.com` |
| `FRONTEND_URL` | `https://app.example.com` |
| `ADMIN_URL` | `https://admin.example.com` |
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | From your database host. |
| `QUEUE_CONNECTION` | `database` |
| `SESSION_DRIVER` | `file` (or `database`) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | From Cloudinary. |
| `PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY` | From Paystack. |
| `MAIL_MAILER` | `resend` |
| `RESEND_KEY`, `MAIL_FROM_ADDRESS` | From Resend, and an address on your domain. |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | The first admin. Pick a strong password of your own. |
| `SUPER_ADMIN_EMAIL` | Usually the same as `SEED_ADMIN_EMAIL`. |
| `FIREBASE_CREDENTIALS` | Optional. Path of the Firebase key file under `storage/`. |
| `BROADCAST_DRIVER` | `log` if you do not run the realtime server (the default in `.env.example`). `reverb` if you do. |
| `REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET` | Optional. Live chat. Any long random text you choose, kept secret. |
| `REVERB_HOST`, `REVERB_PORT`, `REVERB_SCHEME` | Optional. The public address people reach the realtime server at, such as your API domain, `443` and `https`. **Never `localhost` on a real server.** `localhost` only works on your own computer. |

### User app and admin app

These are set per app. Set them **before the build**, because the ones starting with `NEXT_PUBLIC_` are
written into the app while it is built. If you change one later, build again.

| Name | User app | Admin app |
| ---- | -------- | --------- |
| `LARAVEL_API_URL` | `https://api.example.com` | `https://api.example.com` |
| `NEXT_PUBLIC_BASE_URL` | `https://api.example.com` | `https://api.example.com` |
| `NEXT_PUBLIC_APP_URL` | `https://app.example.com` | (not used) |
| `NEXT_PUBLIC_USER_APP_URL` | (not used) | `https://app.example.com` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Optional | (not used) |
| `NEXT_PUBLIC_FIREBASE_*` | Optional | Optional |
| `NEXT_PUBLIC_REVERB_*` | Optional, must match the backend | Optional |

Leave `NEXT_PUBLIC_USERNAME` and `NEXT_PUBLIC_PASSWORD` empty. They only fill the login form on a
developer's computer.

---

# Part 1. The backend

Pick the host you want. Each section is complete on its own.

## 1A. Heroku

Heroku is the quickest start. It has no built-in MySQL, so you add one. Pictures must go to Cloudinary,
because Heroku erases files it stores itself.

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) and run `heroku login`.
2. In the `lemonade-backend` folder, make the app. Heroku app names are shared by everyone, so add
   something of your own, for example `acme-`:

   ```bash
   heroku create acme-lemonade-api --buildpack heroku/php
   heroku apps:info -a acme-lemonade-api
   ```

   Copy the `Web URL` it shows. It looks like `https://acme-lemonade-api-1a2b3c4d5e6f.herokuapp.com`,
   and Heroku adds the letters and numbers, so use the real one wherever this guide says `APP_URL`.
   Do the same for the two apps now, before you deploy anything:
   `heroku create acme-lemonade-app --remote heroku-app` and
   `heroku create acme-lemonade-admin --remote heroku-admin`, run in the `lemonade-web` folder. Then
   `heroku apps:info -a` each one to read its address. You need all three addresses for the next step. See
   [`FRONTEND-DEPLOYMENT.md`](./FRONTEND-DEPLOYMENT.md) for the apps.

3. Add a MySQL database. JawsDB is the common choice:

   ```bash
   heroku addons:create jawsdb:kitefin
   heroku config:get JAWSDB_URL
   ```

   The smallest plan (`kitefin`) limits how many queries you can send per hour, so it is fine for a test
   site but too small for real traffic. Pick a bigger plan before you go live.

   The address it prints looks like `mysql://user:password@host:3306/name`. Copy the four parts into
   `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST` and `DB_DATABASE` in the next step. Set `DB_PORT=3306`.

4. Set the backend values from the table above:

   ```bash
   heroku config:set APP_ENV=production APP_DEBUG=false APP_URL=YOUR-BACKEND-ADDRESS
   heroku config:set APP_KEY=$(php artisan key:generate --show)
   heroku config:set DB_HOST=... DB_PORT=3306 DB_DATABASE=... DB_USERNAME=... DB_PASSWORD=...
   heroku config:set FRONTEND_URL=YOUR-USER-APP-ADDRESS ADMIN_URL=YOUR-ADMIN-APP-ADDRESS
   ```

   The two app addresses are the ones you read in step 2. The apps do not have to be live yet. If you
   change an address later, run `heroku config:set` again and the backend restarts by itself.

   Set `BROADCAST_DRIVER=log` until the realtime app exists (see
   [The background programs the backend needs](#the-background-programs-the-backend-needs)). Setting it to
   `reverb` too early, or on code that is too old to know about Reverb, stops every command with
   `Broadcast connection [reverb] is not defined`.

   Add the rest (Cloudinary, Paystack, Resend, the first admin) the same way.

5. Send the code up. The `Procfile` already tells Heroku to create the database tables on every deploy.

   ```bash
   git push heroku main
   ```

   Heroku only builds what lands on its own `main`. If the code you want to deploy is on another branch,
   name it, for example `git push heroku my-branch:main`. A plain `git push heroku main` sends your local
   `main`, which may be older. Check what Heroku really has with `git ls-remote heroku`, and compare the
   hash next to `refs/heads/main` with `git rev-parse YOUR-BRANCH`.

   `git push` has no `-a` option. The remote name (`heroku`) decides which app receives the code. See
   which app it points at with `git remote -v`.

6. Add the starting data (see [First-time setup](#first-time-setup-after-any-deploy)):

   ```bash
   heroku run "php artisan platform:seed essential --force" -a acme-lemonade-api
   ```

   Keep the quotes. Without them the Heroku command thinks `--force` is meant for itself and stops with
   `Nonexistent flag: --force`. The same goes for any `heroku run` command that has a flag in it, such as
   `heroku run "php artisan migrate --force" -a acme-lemonade-api`. You rarely need that one, because the
   `Procfile` already runs the migration on every deploy.

7. Turn on the background workers. They send emails and notifications and run the timed jobs. They cost
   extra dynos. Live chat needs one more app, explained in
   [The background programs the backend needs](#the-background-programs-the-backend-needs).

   ```bash
   heroku ps:scale worker=1 scheduler=1 -a acme-lemonade-api
   ```

   Run this after the first push. Before that Heroku does not know the `worker` and `scheduler`
   processes exist and refuses. Run it against the API app only. The realtime app has just `web`.

8. Open your backend address followed by `/up`, for example `https://acme-lemonade-api-1a2b3c4d5e6f.herokuapp.com/up`.
   A green page means it works.

To use your own domain, run `heroku domains:add api.example.com` and add the DNS record Heroku shows you.

## 1B. DigitalOcean

Two ways. The **Droplet** is a small server you control. It is the best match for Lemonade because it can
also run the background workers.

1. Create a **Droplet** with Ubuntu 24.04. The 2 GB plan is a good start. Add your SSH key.
2. Create a **Managed MySQL** database in the same region, or install MySQL on the Droplet. Note its host,
   port, name, user and password.
3. Connect and install the tools:

   ```bash
   ssh root@YOUR_DROPLET_IP
   apt update && apt install -y nginx git unzip curl software-properties-common
   add-apt-repository -y ppa:ondrej/php
   apt update && apt install -y php8.3-fpm php8.3-cli php8.3-mysql php8.3-mbstring php8.3-xml \
     php8.3-curl php8.3-zip php8.3-bcmath php8.3-intl php8.3-gd
   curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
   ```

4. Get the code and install it:

   ```bash
   cd /var/www
   git clone YOUR_BACKEND_REPOSITORY_URL lemonade-backend
   cd lemonade-backend
   composer install --no-dev --optimize-autoloader
   cp .env.example .env
   nano .env
   ```

   Fill in the values from the table above, then:

   ```bash
   php artisan key:generate
   chown -R www-data:www-data storage bootstrap/cache
   php artisan migrate --force
   php artisan platform:seed essential --force
   php artisan config:cache && php artisan route:cache
   ```

5. Tell Nginx where the site is. Create `/etc/nginx/sites-available/lemonade` with:

   ```nginx
   server {
       listen 80;
       server_name api.example.com;
       root /var/www/lemonade-backend/public;
       index index.php;

       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }
       location ~ \.php$ {
           include snippets/fastcgi-php.conf;
           fastcgi_pass unix:/run/php/php8.3-fpm.sock;
       }
   }
   ```

   ```bash
   ln -s /etc/nginx/sites-available/lemonade /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   ```

6. Point the DNS record for `api.example.com` at the Droplet's IP, then add a free certificate:

   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d api.example.com
   ```

7. Start the background programs so emails, notifications and timed jobs run (explained in
   [The background programs the backend needs](#the-background-programs-the-backend-needs)). Run
   `crontab -e` and add:

   ```cron
   * * * * * cd /var/www/lemonade-backend && php artisan schedule:run >> /dev/null 2>&1
   ```

   (Skip the cron line if you will use `schedule:work` from the background programs section instead.)

   Then keep the queue worker running. Create `/etc/systemd/system/lemonade-queue.service`:

   ```ini
   [Unit]
   Description=Lemonade queue worker
   After=network.target

   [Service]
   User=www-data
   WorkingDirectory=/var/www/lemonade-backend
   ExecStart=/usr/bin/php artisan queue:work --tries=3 --timeout=90
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

   ```bash
   systemctl enable --now lemonade-queue
   ```

8. Open `https://api.example.com/up` to check.

**App Platform** (DigitalOcean's no-server option) also runs PHP, but it needs a Dockerfile for Laravel and
a separate worker component. Use the Droplet unless you already know App Platform.

## 1C. AWS

The simplest AWS route is **Lightsail**, a plain server with a fixed monthly price.

1. In the AWS console open **Lightsail**, then **Create instance**. Choose Linux, **OS Only**, Ubuntu
   24.04, and the 2 GB plan. Attach a **static IP**, and open ports 80 and 443 in the instance's
   Networking tab.
2. Create the database: Lightsail has **Databases** (choose MySQL 8). Allow the instance to reach it, and
   note the host, name, user and password.
3. Connect to the instance (the **Connect using SSH** button) and follow **steps 3 to 8 of section 1B**.
   They are the same on any Ubuntu server.

If your company already uses AWS in a bigger way, the same steps work on an EC2 instance with an RDS MySQL
database. Put the pictures on Cloudinary either way.

## 1D. Shared hosting (cPanel)

This works for the backend only. Shared hosting cannot run the user and admin apps, so put those on
Heroku, DigitalOcean or AWS (Part 2). Check that your host offers **PHP 8.3**, **MySQL 8** (not an older
MariaDB), **SSH access** and **cron jobs**. If it does not, choose another host.

1. In cPanel open **Select PHP Version** and choose 8.3. Turn on `mbstring`, `xml`, `curl`, `zip`,
   `bcmath`, `intl`, `pdo_mysql` and `openssl`.
2. Open **MySQL Databases**. Make a database and a user, and add the user to the database with all
   privileges.
3. Upload the backend code. The easiest way is SSH:

   ```bash
   cd ~
   git clone YOUR_BACKEND_REPOSITORY_URL lemonade-backend
   cd lemonade-backend
   composer install --no-dev --optimize-autoloader
   cp .env.example .env
   ```

   If you cannot run Composer on the host, run it on your own computer and upload the whole folder
   including `vendor/`.

4. Edit `.env` (cPanel File Manager, then Edit) with the values from the table above. Then:

   ```bash
   php artisan key:generate
   php artisan migrate --force
   php artisan platform:seed essential --force
   php artisan config:cache
   ```

5. **Point the domain at the `public` folder.** In cPanel open **Domains**, choose your API domain, and set
   its document root to `lemonade-backend/public`. If your host does not allow this, ask their support to
   do it. Do not leave the main project folder reachable from the web, because it holds your secrets.
6. Add two cron jobs under **Cron Jobs**, each running every minute. Replace `PHP` with the path your host
   gives for PHP 8.3, often `/usr/local/bin/php`:

   ```cron
   * * * * * cd ~/lemonade-backend && PHP artisan schedule:run >> /dev/null 2>&1
   * * * * * cd ~/lemonade-backend && PHP artisan queue:work --stop-when-empty --tries=3 >> /dev/null 2>&1
   ```

7. Open `https://api.example.com/up` to check.

What does not work on shared hosting: the live chat server (Reverb). Skip the `REVERB_*` values. Chat then
updates when the page reloads.

---

# The background programs the backend needs

The backend is more than a website. Three commands have to keep running on the server all the time. They
are not started by the website, so you must start them yourself, once, and make sure they restart if the
server restarts. Each host below shows how.

| Command | What it does | If it is not running | Needed? |
| ------- | ------------ | -------------------- | ------- |
| `php artisan queue:work` | Does slow jobs in the background: sends emails, push notifications and in-app notifications. | Emails and notifications never go out. | **Yes** |
| `php artisan schedule:work` | Runs the timed jobs: announcements every minute, subscription renewals at 02:00, deleted accounts at 03:00, old logs at 04:00, unused pictures on Sundays. | Renewals, scheduled announcements and cleanups never happen. | **Yes** |
| `php artisan reverb:start` | The live connection for chat and instant notifications. | Chat and notifications only update when the page is reloaded. | Optional |

You can start the scheduler in two ways, so pick one. `schedule:work` is a program that stays running. The
other way is a **cron job** that runs `php artisan schedule:run` every minute, which does the same thing
and is what shared hosting uses.

## What "keeping it running" means

If you type one of these commands in a terminal, it stops when you close the terminal. A server needs a
small helper that starts the command in the background, and starts it again if it crashes or the server
reboots. On a normal server that helper is called **systemd**. On Heroku it is called a **dyno**. On
shared hosting it is a **cron job**.

## On Heroku

The backend's `Procfile` already lists the first two as extra processes next to `web`. They are off until
you turn them on:

```bash
heroku ps:scale worker=1 scheduler=1 -a acme-lemonade-api
```

`worker` runs `queue:work` and `scheduler` runs `schedule:work`. Heroku restarts them on its own.

Reverb needs its own web address, and Heroku only sends web traffic to the `web` process. So run Reverb as
a **second Heroku app** from the same backend code, using the `Procfile.reverb` file in the repository:

Run these in the `lemonade-backend` folder. The realtime app is deployed from the backend repository, not
from `lemonade-web`:

```bash
heroku create acme-lemonade-realtime --remote heroku-realtime --buildpack heroku/php
heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-multi-procfile -a acme-lemonade-realtime
heroku config:set PROCFILE=Procfile.reverb -a acme-lemonade-realtime
# copy the same values as the main backend app, plus the REVERB_ ones
git push heroku-realtime main
heroku ps:scale web=1 -a acme-lemonade-realtime
```

Always put `-a acme-lemonade-realtime` on these commands. Inside the backend folder a command without `-a`
goes to the API app. Setting `PROCFILE=Procfile.reverb` on the API app makes its web process run the
realtime server instead, and the whole API answers `H10 App crashed`. If that happens, run
`heroku config:unset PROCFILE -a acme-lemonade-api`.

The multi-procfile buildpack is what reads `PROCFILE`. Without it Heroku ignores the variable and looks
for a plain `Procfile`. Push the same branch you pushed to the API app. Once the realtime app is up, switch
the API over with `heroku config:set BROADCAST_DRIVER=reverb -a acme-lemonade-api`.
`REVERB_APP_ID`, `REVERB_APP_KEY` and `REVERB_APP_SECRET` must be identical on both apps.

Set `REVERB_HOST` to the new app's host name only, with no `https://` (for example `lemonade-realtime-1a2b3c.herokuapp.com`),
`REVERB_PORT=443` and `REVERB_SCHEME=https` on **both** backend apps, and use the same values in the user
app and admin app as `NEXT_PUBLIC_REVERB_HOST`, `NEXT_PUBLIC_REVERB_PORT`, `NEXT_PUBLIC_REVERB_SCHEME`
and `NEXT_PUBLIC_REVERB_KEY` (the same as `REVERB_APP_KEY`). If this feels like too much for now, skip it.
Everything else works without Reverb.

## On a DigitalOcean Droplet or an AWS Lightsail/EC2 server

Use **systemd**. Make one small file for each command, then switch it on. The queue worker file is in
section 1B. Add these two the same way.

`/etc/systemd/system/lemonade-scheduler.service`:

```ini
[Unit]
Description=Lemonade scheduler
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/lemonade-backend
ExecStart=/usr/bin/php artisan schedule:work
Restart=always

[Install]
WantedBy=multi-user.target
```

`/etc/systemd/system/lemonade-reverb.service` (optional):

```ini
[Unit]
Description=Lemonade Reverb
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/lemonade-backend
ExecStart=/usr/bin/php artisan reverb:start --host=127.0.0.1 --port=8080
Restart=always

[Install]
WantedBy=multi-user.target
```

Then start all three and check they say `active (running)`:

```bash
systemctl daemon-reload
systemctl enable --now lemonade-queue lemonade-scheduler lemonade-reverb
systemctl status lemonade-queue lemonade-scheduler lemonade-reverb
```

If you use `schedule:work` like this, you do **not** also add the `schedule:run` cron job from section 1B.
Use one or the other, never both.

Reverb listens on a private port. To let browsers reach it safely, add this inside the Nginx `server`
block of your API domain, and keep port 8080 closed to the outside:

```nginx
location /app {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
}
location /apps {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
}
```

Then set `BROADCAST_DRIVER=reverb`, `REVERB_HOST` to your API domain (not `localhost`), `REVERB_PORT=443` and
`REVERB_SCHEME=https`, and use the same values in the two apps (`NEXT_PUBLIC_REVERB_*`). The port the
realtime program listens on (8080 above) stays private behind Nginx. If you skip live chat, leave
`BROADCAST_DRIVER=log` and the `REVERB_*` values empty.

After you change the backend code, restart them so they pick up the new code:

```bash
systemctl restart lemonade-queue lemonade-scheduler lemonade-reverb
```

## On shared hosting

You cannot keep a program running, so use **cron jobs** (cPanel, Cron Jobs). Section 1D has the two lines:
the scheduler runs every minute with `schedule:run`, and the queue is emptied every minute with
`queue:work --stop-when-empty`. Reverb cannot run on shared hosting, so skip it.

## How to check they are working

- **Queue:** make a request that sends an email (for example, ask for a password reset). It should arrive
  within a minute. If it does not, run `php artisan queue:failed` to see why.
- **Scheduler:** run `php artisan schedule:list`. It shows when each job is next due. A job that should
  have run, but did not, means the scheduler is not running.
- **Reverb:** open the user app in two browsers, send a chat message in one, and it should appear in the
  other without a reload.

---

# Part 2. The user app and the admin app

You deploy the same code twice, once per app. The only difference is the app name and the values.

The commands to know:

| App | Build | Start |
| --- | ----- | ----- |
| User app | `pnpm install --frozen-lockfile && pnpm build:frontend` | `pnpm start:frontend` |
| Admin app | `pnpm install --frozen-lockfile && pnpm build:admin` | `pnpm start:admin` |

Both need **Node 22 or newer**. The apps listen on the port the host gives them (`PORT`).

## 2A. Heroku

Heroku does run Next.js. Make one Heroku app per website, from the same code. The repository already has a
`Procfile` and build scripts, and a value called `APP_NAME` tells Heroku which website the app is.

The short version, run in the `lemonade-web` folder (the full steps are in
[`FRONTEND-DEPLOYMENT.md`](./FRONTEND-DEPLOYMENT.md)):

```bash
heroku create acme-lemonade-app --remote heroku-app --buildpack heroku/nodejs
heroku config:set -a acme-lemonade-app APP_NAME=lemonade-app \
  LARAVEL_API_URL=YOUR-BACKEND-ADDRESS NEXT_PUBLIC_BASE_URL=YOUR-BACKEND-ADDRESS \
  NEXT_PUBLIC_APP_URL=YOUR-USER-APP-ADDRESS
git push heroku-app main

heroku create acme-lemonade-admin --remote heroku-admin --buildpack heroku/nodejs
heroku config:set -a acme-lemonade-admin APP_NAME=lemonade-admin \
  LARAVEL_API_URL=YOUR-BACKEND-ADDRESS NEXT_PUBLIC_BASE_URL=YOUR-BACKEND-ADDRESS \
  NEXT_PUBLIC_USER_APP_URL=YOUR-USER-APP-ADDRESS
git push heroku-admin main
```

The `--remote` names keep the two apps apart in Git. Set every value before the first push, because the
`NEXT_PUBLIC_` ones are fixed at build time.

## 2B. DigitalOcean App Platform

1. In DigitalOcean choose **Create, App Platform** and connect your `lemonade-web` repository.
2. Make **two separate apps**, one for each website, from the same repository. Do not put both in one
   app, because an app has only one address.
3. For each app set:

   | Setting | User app | Admin app |
   | ------- | -------- | --------- |
   | Build command | `pnpm install --frozen-lockfile && pnpm build:frontend` | `pnpm install --frozen-lockfile && pnpm build:admin` |
   | Run command | `pnpm start:frontend` | `pnpm start:admin` |
   | HTTP port | `8080` | `8080` |

4. Add the values from the table above to each component. Mark them as available at **build time and run
   time**.
5. Add your domains under **Settings, Domains**, and use the DNS records DigitalOcean shows.

You can also run both apps on a Droplet with Node 22, `pm2` and Nginx, the same way as the backend in 1B.

## 2C. AWS

The simplest route is a **Lightsail** instance, the same as the backend (section 1C).

1. Create an Ubuntu instance (the 2 GB plan runs both apps) and open ports 80 and 443.
2. Install Node and the tools:

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
   apt install -y nodejs nginx git
   npm install -g pnpm pm2
   ```

3. Get the code, set the values and build. Put the values in a file called `.env.production` inside each
   app folder (`apps/frontend` and `apps/admin`), then:

   ```bash
   git clone YOUR_WEB_REPOSITORY_URL lemonade-web && cd lemonade-web
   pnpm install --frozen-lockfile
   pnpm build:frontend && pnpm build:admin
   PORT=3000 pm2 start "pnpm start:frontend" --name lemonade-app
   PORT=3001 pm2 start "pnpm start:admin" --name lemonade-admin
   pm2 save && pm2 startup
   ```

4. Add one Nginx site for each domain. Each one forwards to its port. Example for the user app:

   ```nginx
   server {
       listen 80;
       server_name app.example.com;
       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   Use `3001` and `admin.example.com` for the admin app. Then add certificates with
   `certbot --nginx -d app.example.com -d admin.example.com`.

If you prefer, **AWS Amplify Hosting** can build Next.js from a repository. Give it the same build command
and values, and set the app root to `apps/frontend` or `apps/admin`.

## 2D. Shared hosting

Not recommended. The apps need a running Node server, which shared hosting normally does not allow. Put
the backend on shared hosting and the two apps on Heroku, DigitalOcean or AWS.

---

# First-time setup after any deploy

Do these once, in this order.

1. **Check the backend.** Open `https://api.example.com/up`. It should load.
2. **Create the tables and the starting data.** The commands above already ran `migrate`. The starting
   data (categories, subscription plans, settings, and your first admin) comes from the seed:

   ```bash
   php artisan platform:seed essential --force
   ```

   The `essential` set is the only one allowed in production. For a test server with sample users, events
   and tribes, run `php artisan platform:seed stress --force` on **staging only**. The options are all
   explained in the backend `README.md`, under **Seeding the database**.
3. **Make yourself the super admin:**

   ```bash
   php artisan admin:sync-super-admin
   ```

4. **Log in to the admin app** at `https://admin.example.com` with `SEED_ADMIN_EMAIL` and
   `SEED_ADMIN_PASSWORD`, then change the password.
5. **Tell Paystack about your backend.** In the Paystack dashboard, under Settings, API Keys and Webhooks,
   set the webhook address to `https://api.example.com/v1/shared/payment/paystack/webhook`.
6. **Try the whole path.** Sign up on the user app, open an event, and make a small test payment with a
   Paystack test card. Check the payment shows in the admin app under Payments review.

# Keeping it healthy

- **Update the backend:** pull the new code, then `composer install --no-dev --optimize-autoloader`,
  `php artisan migrate --force`, `php artisan config:cache`, and restart the queue worker
  (`systemctl restart lemonade-queue`, or `heroku ps:restart worker`). Deploy the backend before the apps
  when a change touches both.
- **Update the apps:** pull, then build and start again. Changing a `NEXT_PUBLIC_` value needs a new build.
- **Back up the database** every day. Managed databases on DigitalOcean, AWS and Heroku have a backup
  switch. Turn it on.
- **Clean up unused pictures:** the backend does this each Sunday on its own (`media:prune`). It needs the
  scheduler from the steps above.
- **Look at the logs:** `storage/logs/laravel.log` on a server, `heroku logs --tail` on Heroku.

# If something goes wrong

| What you see | What to check |
| ------------ | ------------- |
| A white page or "500" on the backend | Set `APP_DEBUG=true` for a minute to see the error, then set it back to `false`. Check `storage/logs/laravel.log`. Make sure `storage` and `bootstrap/cache` can be written to. |
| You cannot set `FRONTEND_URL` and `ADMIN_URL` because the apps are not deployed | You can. Create the two apps (or choose their domain names) first and read their addresses. Nothing has to be live to set a value. See the start of this guide. |
| The apps say they cannot reach the server | `LARAVEL_API_URL` is wrong, or has a trailing slash or `http` instead of `https`. Fix it and restart the app. |
| Uploading a picture says `URI must include a scheme and host` | `CLOUDINARY_UPLOAD_PREFIX` is set on the backend. It is not a folder name, it is only for test stand-ins. Remove it with `heroku config:unset CLOUDINARY_UPLOAD_PREFIX -a YOUR-API-APP`. |
| Pictures do not show in the apps | Uploads must go to Cloudinary. Check the three `CLOUDINARY_` values. |
| Emails and notifications never arrive | The queue worker is not running. See [The background programs the backend needs](#the-background-programs-the-backend-needs). |
| Payments stay "pending" | The Paystack webhook address is missing or wrong (setup step 5). |
| Every API request answers `H10 App crashed`, and the log shows `reverb:start` | `PROCFILE=Procfile.reverb` was set on the API app. Run `heroku config:unset PROCFILE -a YOUR-API-APP`. |
| `Undefined constant ...SIGINT` when Reverb starts | The PHP `pcntl` extension is not loaded. The backend's `composer.json` must require `ext-pcntl`. Deploy the latest backend code. |
| Seeding the `demo` or `stress` profile stops with `Call to undefined function ... fake()` | The sample-data library (Faker) was missing from the production build. It is now a normal dependency, so deploy the latest backend code and run the seed again. |
| Seeding stops with `exceeded the 'max_questions' resource` | The database plan caps how many queries you can send per hour (the small JawsDB plan allows 3600). The `stress` profile sends far more. Wait an hour for the count to reset, use a smaller `--scale`, or move to a bigger database plan. Do not run `stress` on the plan you use for a live site. |
| Seeding says to set a password | Set `SEED_ADMIN_PASSWORD` to something other than the sample, then run it again. |
| A new `NEXT_PUBLIC_` value has no effect | Those are fixed at build time. Build the app again. |
| `Broadcast connection [reverb] is not defined` | Either the deployed code is older than the Reverb setup (check the branch you pushed, see step 5), or `BROADCAST_DRIVER=reverb` is set before the realtime app exists. Deploy the right branch, and use `log` until Reverb is running. |
| `platform:seed` is not a known command | Heroku has an older branch. Push the branch that has it, for example `git push heroku my-branch:main`. |
| `error: unknown switch 'a'` on `git push` | `-a` belongs to the `heroku` command, not `git`. Use the remote name instead, for example `git push heroku-realtime main`. |
| `heroku ps:scale worker=1` says the process type does not exist | The first push has not finished yet, or you ran it against the wrong app. Scale `worker` and `scheduler` on the API app after it is deployed. |
| Login works, but you are logged out on refresh | The three apps must use `https`, and the backend's `FRONTEND_URL` and `ADMIN_URL` must match the real addresses. |

When you are stuck, the quickest help is the exact error text from the log, and which step you were on.
