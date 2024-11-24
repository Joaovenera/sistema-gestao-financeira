#!/bin/bash

# Variáveis
NAMESPACE="staging"
DEPLOYMENT="financial-api-staging"

# Atualizar configurações do Kubernetes
kubectl apply -f k8s/staging/deployment.yaml
kubectl apply -f k8s/staging/service.yaml
kubectl apply -f k8s/staging/hpa.yaml

# Verificar status do deployment
kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE

# Verificar pods
kubectl get pods -n $NAMESPACE -l app=financial-api

# Mostrar logs dos últimos pods
kubectl logs -n $NAMESPACE -l app=financial-api --tail=100 