'use strict';
// Your client side JavaScript code goes here.


$('#addList').click(function () {
  createList(nameInput, 2, ['testlist']);
  var nameInput = text("listName");
})




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

// Example code for displaying lists in the browser
function displayLists(lists) {
  // Lists should be ordered based on their 'pos' field
  lists.rows = _.sortBy(lists.rows, 'pos');
  lists.rows.forEach(function(list) {
    var curElem = $('<div>');
    var headline = $('<h3>').text(list.name);
    curElem.append(headline);
    if (list.cards) {
      var innerUl = $('<div>');
      list.cards.forEach(function(card) {
        innerUl.append($('<div>').text(card));
      });
      curElem.append(innerUl);
    }
    $('#lists').append(curElem);
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
      createList('Hello', 0, ['Card 1', 'Card 2','myCard'])
        .then(function(list) {
          console.log('Created list', list);
          return loadLists();-_                                                                                      
        })
        .then(function(lists) {
          displayLists(lists);
        })
    }

  });
