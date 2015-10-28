// Initialize Parse app
Parse.initialize('WdLdlM8xOhaERo3V25TVdcNwAstmuE0xKLh10XUr','vA9RsaJnEwlHBGKi93me6AEJerwPCzrUXIJSwY4E');

// Create a new sub-class of the Parse.Object, with name "Review"
var Review = Parse.Object.extend('Review');

$('#stars').raty({
	half: true,
	starHalf: 'star-half.png'
});

// Create a new instance of your Review class
// This allows the users input/content to be published in the HTML  
$('#post-form').submit(function(event){
	event.preventDefault();

	var coolInt = new Review();

	var name = $('#review').val();
	coolInt.set('review', name);
	

	var word = $('#description').val();
	coolInt.set('description', word);
	

	var rating = $('#stars').raty('score');
	console.log(rating);
	coolInt.set('stars', rating);

	
	coolInt.set('like',0);
	coolInt.set('dislike',0);
	//clears the data after user clicks Save button
	$(this).find('input').each(function(){
		coolInt.set($(this).attr('id'), $(this).val());
			$(this).val('');
	})

	//So the page does not need to be refreshed
	coolInt.save().then(function() {
		console.log('successfully saved');
		getData();
	});

	
});


// // Click event when form is submitted
// $('form').submit(function() {

// 	// Create a new instance of Review class 
// 	// var review = new Review();

// 	// For each input element, set a property of your new instance equal to the input's value
// 	$(this).find('input').each(function(){
// 		review.set($(this).attr('id'), $(this).val());
// 			$(this).val('');
// 	})

// 	$(this).find('textarea').each(function(){
// 		review.set($(this).attr('id'), $(this).val());
// 			$(this).val('');
// 	})
	
	
// 	// After setting each property, save your new instance back to your database
// 	review.save(null, {
// 		success:getData
// 	});
// 	return false;
// })



// Write a function to get data
var getData = function() {
	

	// Set up a new query for Review class
	var query = new Parse.Query(Review);

	// Set a parameter for your query -- where the website property isn't missing
	query.notEqualTo('description', '');

	 //Execute the query using ".find".  When successful:
	 //   - Pass the returned data into your buildList function
	
	query.find({
		success:function(results){
			buildList(results);
		},
		error: function(error) {
			console.log(error);
			console.log(error.message);
		}
		// or I can write:
		// success: buildList; 
	})
}

// A function to build your list
var buildList = function(data) {
	// Empty out your unordered list
	$('ol').empty();

	var count = 0;
	var bottom = data.length;
	//console.log(data);
	for (var i = 0; i < bottom; i++){
		//console.log(data[i].get('stars'));
		count +=data[i].get('stars');
	}
	//console.log(count);
	count/=bottom
	//console.log(count);
	$('#starAvg').raty({readOnly: true, score: function() {
		return count;
	}});

	// Loop through your data, and pass each element to the addItem function
	data.forEach(function(d) {
		addItem(d, bottom);
	})
}


// This function takes in an item, adds it to the screen
var addItem = function(item) {
	// Get parameters from the data item passed to the function
	var review = item.get('review');
	var description = item.get('description');
	var likes = item.get('like');
	var dislikes = item.get('dislike');
	var starsOfReviews = item.get('stars');
	// Append li that includes text from the data item

	var li = $('<div class="well">' + '<div id = "starsRate">' + '</div>' + review +'</p>' + '<p>'+ description + '</p>' + '</div>');
	var button = $('<button class="btn-danger btn-xs"><span>Remove</span></button>' + '<p></p>');
	var button2 = $('<div>' + 'Helpful or not?</div>' + '<button class="btn-info btn-xs"><span class="glyphicon glyphicon-thumbs-up"></span></button>');
	var button3 = $('<button class="btn-info btn-xs"><span class="glyphicon glyphicon-thumbs-down"></span></button>');
	var like = $('<p> '+likes+' out of '+(likes+dislikes)+' people thought helpful</p>');
	button.click(function() {
		item.destroy({
			success:getData
		});
	});
	//calculates the number of people hitting thumbs up or thumbs down
	button2.click(function() {
		item.increment('like');
		item.save(null, {
			success:getData
		});
	});

	button3.click(function() {
		
		item.increment('dislike');
		item.save(null, {
			success:getData
		});
	});
	
	var addHere = '<div></div>';
	var displayStars = $('#starsRate').raty({readOnly: true, score: starsOfReviews});	

	li.append(displayStars);


	li.append(button);
	li.append(button2);
	li.append(button3);
	li.append(like);
	$('ol').append(li);

}


getData();

