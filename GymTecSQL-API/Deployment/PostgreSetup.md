# Guía Setup PostgreSQL DB
### Requisitos
- Máquina Windows con el motor de Docker (WSL 2) y Docker Desktop instalado.

## Iniciar contenedores
- **Crear** una carpeta vacía donde se guardarán los datos de Postgres: `C:\GymTEC`
- **Copiar** dentro de la carpeta creada el archivo de configuración de Docker Compose (`docker-compose.yml`)
- **Navegar** hasta la carpeta recién creada y **ejecutar** el comando:
```
docker compose up -d
```
Una vez terminada la instalacion se puede verificar que los contenedores estén iniciados con el comando:

```
docker ps
```

En caso de que los contenedores no estén iniciados, para listar todos los contenedores:
```
docker ps -a
```
y para iniciar los contenedores:
```
docker start <container_id>
```

## Acceso a la base de datos
Una vez realizada la instalación la base de datos puede ser accedida ya sea con por medio del API o con la interfaz provista por Adminer (Development only). 
En el caso del API, basta revisar que en `appsetings.json` la string de conexion `GymTecConnection` tenga los datos correctos.

