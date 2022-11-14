## Login Teste - Prime Group

### TODO
-> Lidar com erros de JWT (token expirado...)

-> Session Tokens (Ajustar o tempo)

-> Utilizar localStorage para transportar dados do utilizador ou cookies(?)

-> Lidar com alguns erros no Login (Não está muito bom)

-> Passar info sensivel para .env em vez de hard-coded


### Notes
-> Provavelmente precisarão de ir ao mysql correr isto !! Para conseguir ligar à bd

    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
    FLUSH PRIVILEGES;

npm install bcryptjs cors express jsonwebtoken mysql

Para correr:
    npm run dev
    -> http://localhost:3000!!
