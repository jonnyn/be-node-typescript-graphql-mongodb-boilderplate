up:
	@docker-compose up -d --build
	@docker-compose ps
	@docker-compose logs --follow tipbox-api | ./node_modules/.bin/bunyan

down:
	@docker-compose down

ps:
	@docker-compose ps

logs:
	@docker-compose logs --follow tipbox-api | ./node_modules/.bin/bunyan

test:
	@docker-compose up -d --build
	@docker-compose run --rm tipbox-api-test npm run test:integration

pull:
	@docker-compose pull
