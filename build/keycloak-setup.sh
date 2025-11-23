#!/bin/bash

echo "Importing realm configuration..."
docker cp keycloak-realm.json $(docker-compose ps -q keycloak):/tmp/keycloak-realm.json

docker-compose exec keycloak /opt/keycloak/bin/kcadm.sh config credentials \
  --server http://localhost:8080 \
  --realm master \
  --user admin \
  --password admin

docker-compose exec keycloak /opt/keycloak/bin/kcadm.sh create realms \
  -f /tmp/keycloak-realm.json

echo "Keycloak realm 'vue-app' has been configured!"
echo ""
echo "Test user credentials:"
echo "  Username: demo"
echo "  Password: demo"
echo ""
echo "Update your .env file with:"
echo "  VITE_KEYCLOAK_URL=http://localhost:8081"
echo "  VITE_KEYCLOAK_REALM=vue-app"
echo "  VITE_KEYCLOAK_CLIENT_ID=vue-template"
