install:
	sudo apt-get update
	curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
	sudo apt-get install -y nodejs

clean:
	sudo apt-get purge nodejs
	sudo apt-get autoremove