'use strict';
// Your client side JavaScript code goes here.


$('#addList').click(function () {
  createList('List', 2, ['testlist', 'testlist2']).then(function (data) {
    console.log('createList', data);
    buildCard(data);
  });
    
}); //Ende click-Funktion

function deleteList(id) {
  return $.ajax('/api/lists' + id, {
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


function buildCard (list) {
  var lists = $('#lists');
  var column = $('<div>').attr('class', 'column').attr('data-listid', list.id);
  var curElem = $('<div>');
  var headline = $('<h3>').text(list.name);
  curElem.append(headline);
  if (list.cards) {
    var innerUl = $('<div>').attr('class', 'cards');
    list.cards.forEach(function(card) {
      innerUl.append($('<div>')
        .text(card)
        .attr('class', 'card')
        );
    });
    curElem.append(innerUl);
  }
  column.append(curElem);
  lists.append(column);
}


// Example code for displaying lists in the browser
function displayLists(lists) {
  // Lists should be ordered based on their 'pos' field
  lists.rows = _.sortBy(lists.rows, 'pos');
  lists.rows.forEach(function(list) {
     var listElem = buildCard(list);
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
