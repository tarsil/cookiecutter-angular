.DEFAULT_GOAL := help

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: upgrade
upgrade: ## Upgrades the angular cli and the angular core
	ng update @angular/cli @angular/core

.PHONY: serve
serve: ## Starts the angular development server (Frontend)
	ng serve --port 4200

.PHONY: component
component: ## Creates a new angular component
	ng generate component

.PHONY: service
service: ## Creates a new angular service in the format of app/<service-name>. E.g.: todo/todo
	ng generate service

.PHONY: build-prod
build-prod: ## Builds the project to be ready for production
	ng build --prod

.PHONY: build-local
build-local: ## Builds the project to be ready for production
	ng build

.PHONY: tests
tests: ## Run the tests on local
	ng test

.PHONY: e2e-tests
e2e-tests: ## Run the end to end tests on local
	ng e2e

.PHONY: deploy-github-page
deploy-github-page: ## If you want to deploy to a Github page you can do the following. E.g.: ng build --prod --output-path docs --base-href "/angular-todo-app/"
	ng build --prod --output-path docs --base-href ${BASEPATH}

.PHONY: requirements
requirements: ## Run the end to end tests on local
	npm i
