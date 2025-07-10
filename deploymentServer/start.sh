#!/bin/bash

echo "Copying over base NGINX config..."
cp -r -f ./nginx/* /etc/nginx/

echo "Running Ansible playbook to render NGINX configs..."
ansible-playbook /app/server/render_nginx_template.yaml -e "red_env=alpha enable_test_route=false" --tags frontend
ansible-playbook /app/server/render_nginx_template.yaml -e "red_env=alpha enable_test_route=false" --tags backend

echo "Starting Node.js server..."
npm start