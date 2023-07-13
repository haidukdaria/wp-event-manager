document.addEventListener("DOMContentLoaded", function () {
  const mediaEndpoint = restApiSettings.root + "wp/v2/media"
  const eventsEndpoint = restApiSettings.root + "wp/v2/event"
  const nonce = restApiSettings.nonce

  const addEventForm = document.getElementById("admin-add-form")
  const eventListBody = document.getElementById("event-list-body")
  const eventList = document.getElementById("events-list")

  if (addEventForm) {
    addEventForm.addEventListener("submit", function (e) {
      e.preventDefault()  
  
      //add spinner to form
      addEventForm.classList.add('loading');
  
      //get all form elements
      const formElements = addEventForm.elements
  
      //get event post data
      const eventName = formElements["event-name"].value
      const eventPrice = formElements["event-price"].value
      const eventDescription = formElements["event-description"].value
      const eventImage = formElements["event-image"].files[0]
  
      const formData = new FormData()
      formData.append("file", eventImage)
      
      //first upload image to media
      fetch(mediaEndpoint, {
        method: "POST",
        headers: {
          "X-WP-Nonce": nonce,
        },
        body: formData,
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("Image added: ", data)
  
        const imageId = data.id
        const formData = new FormData()
        formData.append("title", eventName)
        formData.append("featured_media", imageId)
        formData.append("event_price", eventPrice)
        formData.append("content", eventDescription)
        formData.append("status", "publish")
  
        //then add post with the image
        return fetch(eventsEndpoint, {
          method: "POST",
          headers: {
            "X-WP-Nonce": nonce,
          },
          body: formData,
        })
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Post created: ", data)
  
        //then get new events list
        return fetch(eventsEndpoint)
      })
      .then((response) => response.json())
      .then((events) => {
        console.log("Posts recieved: ", events)
  
        if (!eventListBody) {
          return
        }
  
        //then render the new list on front
        renderEventsList(events);
  
        //remove spinner, clear the form
        addEventForm.classList.remove('loading');
        addEventForm.reset();
      })
      .catch((error) => {
        console.error(error)
      })
    })
  }

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('events-list__btn--delete')) {

      //DELETE HANDLER
      const confirmDelete = confirm("Are you sure you want to delete this event?");

      if (confirmDelete) {
        const eventId = parseInt(e.target.closest('.events-list__row').dataset.eventId);
      
        //add spinner to events list
        eventList.classList.add('loading');

        fetch(`${eventsEndpoint}/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "X-WP-Nonce": nonce,
          },
        })
        .then(response => {
          if (response.ok) {
            console.log('Event deleted succesfully');

            //then get new events list
            return fetch(eventsEndpoint)
          } else {
            eventList.classList.remove('loading');
            alert(`Error: ${ response.statusText}` )
            throw Error(response.statusText);
          }
        })
        .then((response) => response.json())
        .then((events) => {
          console.log("Posts recieved: ", events)
    
          if (!eventListBody) {
            return
          }
    
          //then render the new list on front
          renderEventsList(events);
    
          //remove spinner, clear the form
          eventList.classList.remove('loading');
        })
        .catch(error => {
          console.error(error)
        });
      }
    }


    if (e.target.classList.contains('events-list__btn--edit')) {
      
    }
  })

  function renderEventsList(events) {
    let content = ""

    if (Array.isArray(events)) {
      events.forEach((event) => {
        content += `<li class="events-list__row" data-event-id="${event.id}">
        <div class="events-list__row-cell events-list__row-cell--name">${event.title.rendered}</div>
        <div class="events-list__row-cell events-list__row-cell--price">${event.meta.event_price}$</div>
        <div class="events-list__row-cell events-list__row-cell--operations">
          <button class="events-list__btn events-list__btn--edit">Edit</button>
          /
          <button class="events-list__btn events-list__btn--delete">Delete</button>
        </div>
      </li>`
      });
    }
    
    if (content === '') {
      content = '<li class="events-list__row empty">No events yet :( </li>';
    }

    if (eventListBody) {
      eventListBody.innerHTML = content
    }
  }
})
