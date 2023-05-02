frontend
	*angular is Single page application
		httpClient => \api\readings > http response
	 chart.js 
	 angular material
	angular cli - jre
	typescript : javascript . var i:int = 0; var j=0; j = saravana;
	angular way
	bootstrap - styles
	ngrx - library
backend
	*express - app server running in node runtime
		\api\readings - GET
		\api\alerts   - POST, GET
		\api\login    - POST
		\api\register - POST
	mongoose ( driver for mongodb )
		db.readings.find({}) => Reading.Find()
		db.readings.findOne({}) => Reading.FindOne()
		db.readings.insert({}) => Reading.Create()
	cors
	mqtt ( driver for mqtt )
		subscribe()
		on('message',function(message){
			Reading.Create();
			if(alert){
			}
		});

	mailer
		

					

system > Os > Java(JRE) or python interpreter or javascript interpreter(node)