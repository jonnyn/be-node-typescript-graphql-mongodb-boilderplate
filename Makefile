up:
	@docker-compose up -d --build
	@docker-compose ps
	@docker-compose logs --follow project-api | ./node_modules/.bin/bunyan

down:
	@docker-compose down

ps:
	@docker-compose ps

logs:
	@docker-compose logs --follow project-api | ./node_modules/.bin/bunyan

test:
	@docker-compose up -d --build
	@docker-compose run --rm project-api-test npm run test:integration

pull:
	@docker-compose pull
