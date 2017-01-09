'use strict';
// Your client side JavaScript code goes here.


$('#addList').click(function () {
<<<<<<< HEAD
  var nameInputList = $('#nameList').val();
  createList(nameInputList,2).then(function (data) {
  //createList('List', 2, ['testlist', 'testlist1']).then(function (data) {
    console.log('createList', data);
    buildList(data);
    });
 }); 


//neue Karte hinzufügen Button
function addCardButton() {
  $('.addCard').click(function () {
    var id = parseInt($(this).attr('data-listid'));
    console.log('id ' + id);
    loadSingleList(id).then(function(data) {
      console.log('data ',data);
    var inputTextCard = $('.inputCard').val();
    data.cards.push(inputTextCard);
    return updateLists(id, data.name, data.pos, data.cards);
    }).then(function(list){
      console.log(list);
      buildList(list);
    })
  
  });
}


    


/*function turnTextIntoInputField(inputId){
  var inputIdWithHash = "#" + inputId;
  var elementValue = $(inputIdWithHash).text();
  $(inputIdWithHash).replaceWith('<input name="test" id"' + inputId + '"type=text" value="' + elementValue + '">');

  $(document).on('click.' + inputId, function(event){
    if (!$(event.target).closest(inputIdWithHash).length) {
      $(document).off('click.' + inputId);
      var value = $(inputIdWithHash).val();
      $(inputIdWithHash).replaceWith('<p id="' + inputId + '"onclick="turnTextIntoInputField(\'' + inputId + '\')">' + value + '<p>');
      }
  });
}
*/

$('h1').click(function() {
    var input = $("<input>", {
        val: $(this).text(),
        type: "text" });
    $(this).replaceWith(input);
    //input.select();
    //var saveButton = $('<button>').text('accept');
    //$('h1').append(saveButton);
    
    return $.ajax('/api/lists' + id);
});






function deleteList(id) {
  return $.ajax('/api/lists/' + id, {
=======
  createList('List', 2, ['testlist', 'testlist1']).then(function (data) {
    console.log('createList', data);
    buildCard(data);
  });
    
}); //Ende click-Funktion

function deleteList(id) {
  return $.ajax('/api/lists' + id, {
>>>>>>> d3b7e1287e7776457fa57d39485bd8e5b0110f40
    type: 'DELETE',
  });
} //Ende deleteList


// This file is included in every page.

// Example code for creating a list on the server
function createList(name, pos, cards) {
  return $.ajax('/api/lists', {
    type: 'POST',
    data: {
      name: name,
      pos: pos,
      cards: cards
    }
  });
}

// Example code for getting all `list`s from server
function loadLists() {
  return $.ajax('/api/lists');
}

<<<<<<< HEAD
function loadSingleList(id) {
  return $.ajax('/api/lists/' + id);
}

function updateLists(id,name, pos, cards) {
  return $.ajax('/api/lists/' + id, {
    type: 'POST',
    data: {
      name: name,
      pos: pos,
      cards: cards
    }
  });
}


function buildList (list) {
=======

function buildCard (list) {
>>>>>>> d3b7e1287e7776457fa57d39485bd8e5b0110f40
  var lists = $('#lists');
  var column = $('<div>').attr('class', 'column').attr('data-listid', list.id);
  var curElem = $('<div>');
  var headline = $('<h3>').text(list.name);
<<<<<<< HEAD
  curElem.append(headline);
  column.append(curElem);
  lists.append(column);
  

//Karte hinzufügen
  var inputCard = $('<textarea>').attr('class', 'inputCard');
  var addCard = $('<button>').text('add card...').attr('class', 'addCard').attr('data-listid', list.id);
  addCardButton();
    if (list.cards) {
=======
  var addCard = $('<button>').text('add card') .attr('class', 'addCard');
  curElem.append(headline);
  if (list.cards) {
>>>>>>> d3b7e1287e7776457fa57d39485bd8e5b0110f40
    var innerUl = $('<div>').attr('class', 'cards');
    list.cards.forEach(function(card) {
      innerUl.append( $('<div>').text(card).attr('class', 'card') );
    });
    curElem.append(innerUl);
<<<<<<< HEAD
  }
  curElem.append(inputCard);
  curElem.append(addCard);
}

=======
    curElem.append(addCard);
  }
  column.append(curElem);
  lists.append(column);
}


>>>>>>> d3b7e1287e7776457fa57d39485bd8e5b0110f40
// Example code for displaying lists in the browser
function displayLists(lists) {
  // Lists should be ordered based on their 'pos' field
  lists.rows = _.sortBy(lists.rows, 'pos');
  lists.rows.forEach(function(list) {
<<<<<<< HEAD
     var listElem = buildList(list);
=======
     var listElem = buildCard(list);
>>>>>>> d3b7e1287e7776457fa57d39485bd8e5b0110f40
  });
}

function deleteLists(lists) {
  return $.ajax('/:id')
}

// start: execute functions above
loadLists()
  .then(function(data) {
    console.log('Lists', data.rows);
    if (data.rows.length) {
      // If some lists are found display them
      displayLists(data);
    } else {
      // If no lists are found, create sample list
      // and re-display.
      console.log('No lists found, creating one.');
      createList('Your first list', 0, ['Example-card 1', 'Example-card 2','my card'])
        .then(function(list) {
          console.log('Created list', list);
          return loadLists();                                                                                    
        })
        .then(function(lists) {
          displayLists(lists);
        })
    }

  });
