import {pubsub} from './pubsub.js'

export const movies = {
  list: [],
  render: container => {
    let template = document.getElementById('movieListTemplate');
    let div = template.content.cloneNode(true);
    container.appendChild(div);
    let ul = document.querySelector('.movie-container ul');
    ul.addEventListener('click', movies.movieDeleted);

    // tell the pubsub controller that we want to know about any movieAdded event
    console.log('MOVIES: want to know if a movie is added');
    pubsub.subscribe('movieAdded', movies.movieAdded);
  },
  movieAdded: title => {
    // movieAdded event was published
    console.log(`MOVIE: I hear that ${title} was added`);
    let list = new Set(movies.list);
    list.add(title);
    movies.list = Array.from(list).sort();

    // tell everyone that a movie has been added to the list
    console.log('MOVIES: moviesUpdated the list');
    pubsub.publish('moviesUpdated', movies.list);

    // then the ui stuff for a new movie list
    let ul = document.querySelector('.movie-container ul');
    ul.innerHTML = '';
    let df = document.createDocumentFragment();
    movies.list.forEach(title => {
      let li = document.createElement('li');
      li.innerHTML = title;
      df.appendChild(li);
    });
    ul.appendChild(df);
  },
  movieDeleted: ev => {
    let item = ev.target.closest('li');
    let title = item.textContent;
    movies.list = movies.list.filter(tl => tl !== title);
    item.parentElement.removeChild(item);

    console.log(`MOVIES: movieDeleted the ${title}`);
    pubsub.publish('movieDeleted', movies.list);
  }
};