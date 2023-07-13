document.addEventListener("DOMContentLoaded", function () {
  const mediaEndpoint = restApiSettings.root + "wp/v2/media"
  const eventsEndpoint = restApiSettings.root + "wp/v2/event"
  const nonce = restApiSettings.nonce

  const addEventForm = document.getElementById("admin-add-form")
  const editEventForm = document.getElementById("admin-edit-form")
  const editEventFormWrapper = document.querySelector(".event-manager__edit-form-wrapper")
  const eventListBody = document.getElementById("event-list-body")
  const eventList = document.getElementById("events-list")
  const eventDescription = document.getElementById("event-description")

  // ADD EVENT FORM SUBMIT
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
        formData.append("excerpt", eventDescription)
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
        console.log("Updated post list recieved: ", events)
  
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

  // EDIT EVENT FORM SUBMIT
  if (editEventForm) {
    editEventForm.addEventListener("submit", function(e) {
      e.preventDefault()  
      //add spinner to form
      editEventForm.classList.add('loading');
      
      //get event id
      const eventId = editEventForm.dataset.eventId;

      //get all form elements
      const formElements = editEventForm.elements
  
      //get event post data
      const eventName = formElements["event-name"].value
      const eventPrice = formElements["event-price"].value
      const eventDescription = formElements["event-description"].value
  
      //if new image is loaded - load image first
      if (formElements["event-image"].files.length) {
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
          if (data.id) {
            console.log("New image added: ", data)
      
            const imageId = data.id
            const formData = new FormData()

            formData.append("title", eventName)
            formData.append("featured_media", imageId)
            formData.append("event_price", eventPrice)
            formData.append("excerpt", eventDescription)
      
            //then update post with the image
            return fetch(`${eventsEndpoint}/${eventId}`, {
              method: "POST",
              headers: {
                "X-WP-Nonce": nonce,
              },
              body: formData,
            })
          }
          else {
            throw Error('Image was not loaded');
          }
        })
        .then((response) => response.json())
        .then((data) => {
          console.log("Post updated: ", data)
    
          //then get new events list
          return fetch(eventsEndpoint)
        })
        .then((response) => response.json())
        .then((events) => {
          console.log("Updated post list recieved: ", events)
    
          if (!eventListBody) {
            return
          }
    
          //then render the new list on front
          renderEventsList(events);
    
          //remove spinner, clear the form
          editEventForm.classList.remove('loading');

          editEventFormWrapper.classList.add('disabled');
          editEventForm.reset();
          editEventForm.querySelector('#current-image').innerHTML = '';
        })
        .catch((error) => {
          console.error(error)
        })
      }
      //if text content is being updated only
      else {
        const formData = new FormData()

        formData.append("title", eventName)
        formData.append("event_price", eventPrice)
        formData.append("excerpt", eventDescription)

        //update post
        fetch(`${eventsEndpoint}/${eventId}`, {
          method: "POST",
          headers: {
            "X-WP-Nonce": nonce,
          },
          body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
          console.log("Post updated: ", data)
    
          //then get new events list
          return fetch(eventsEndpoint)
        })
        .then((response) => response.json())
        .then((events) => {
          console.log("Updated post list recieved: ", events)
    
          if (eventListBody) {
            //then render the new list on front
            renderEventsList(events);

            //remove spinner, clear the form
            editEventForm.classList.remove('loading');

            editEventFormWrapper.classList.add('disabled');
            editEventForm.reset();
            editEventForm.querySelector('#current-image').innerHTML = '';
          }
        })
        .catch((error) => {
          console.error(error)
        })
      }
    })
  }


  // EDIT, DELETE, READ MORE BUTTONS
  document.addEventListener('click', function(e) {

    //DELETE HANDLER
    if (e.target.classList.contains('events-list__btn--delete')) {
      const confirmDelete = confirm("Are you sure you want to delete this event?");

      if (confirmDelete) {
        // reset editform
        editEventFormWrapper.classList.add('disabled');
        editEventForm.reset();
        editEventForm.querySelector('#current-image').innerHTML = '';

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

    //EDIT HANDLER
    if (e.target.classList.contains('events-list__btn--edit')) {
      const eventId = parseInt(e.target.closest('.events-list__row').dataset.eventId);
      
      //set eventId and add spinner to edit form
      editEventForm.classList.add('loading');
      editEventForm.dataset.eventId = eventId;

      const formElements = editEventForm.elements

      fetch(`${eventsEndpoint}/${eventId}`)
      .then(response => response.json())
      .then(event => {        
        const imageid = event.featured_media;

        if (imageid) {
          fetch(`${mediaEndpoint}/${imageid}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.guid.rendered) {
              editEventForm.querySelector('#current-image').innerHTML =  `<img src="${data.guid.rendered}">`
            }

            editEventForm.classList.remove('loading');
            editEventFormWrapper.classList.remove('disabled')

            //set event post data into form
            formElements["event-name"].value = event.title.rendered;
            formElements["event-price"].value = event.meta.event_price;
            formElements["event-description"].value = event.raw_excerpt
          })
          .catch(error => {
            console.error(error)
          });
        }
        else {
          //set event post data into form
          formElements["event-name"].value = event.title.rendered;
          formElements["event-price"].value = event.meta.event_price;
          formElements["event-description"].value = event.raw_excerpt
          editEventForm.querySelector('#current-image').innerHTML =  '<p class="events-admin-form__message">No image yet</з>';
          editEventForm.classList.remove('loading');
          editEventFormWrapper.classList.remove('disabled')
        }
      })
      .catch(error => {
        console.error(error)
      });
    }

    //READ MORE HANDLER
    if (e.target.classList.contains('events-list__btn--read-more')) {
      document.querySelector('.events-list__btn--read-more.active').classList.remove('active')
      e.target.classList.add('active')
      const eventId = parseInt(e.target.closest('.events-list__row').dataset.eventId);

      eventDescription.classList.add('loading');

      const titleContainer = eventDescription.querySelector('.event-description__title')
      const priceContainer = eventDescription.querySelector('.event-description__price')
      const contentContainer = eventDescription.querySelector('.event-description__content')
      const imageContainer = eventDescription.querySelector('.event-description__image')

      fetch(`${eventsEndpoint}/${eventId}`)
      .then(response => response.json())
      .then(event => {
        console.log('Event details recieved: ', event)

        const imageid = event.featured_media;

        if (imageid) {
          fetch(`${mediaEndpoint}/${imageid}`)
          .then((response) => response.json())
          .then((image) => {
            const url = image.media_details.sizes.medium ? image.media_details.sizes.medium.source_url : image.media_details.sizes.full.source_url
            imageContainer.innerHTML =  `<img src="${url}">`
          
            //set event post data into form
            titleContainer.innerHTML = event.title.rendered;
            priceContainer.innerHTML = event.meta.event_price;
            contentContainer.innerHTML = event.raw_excerpt

            eventDescription.classList.remove('loading');
          })
          .catch(error => {
            console.error(error)
          });
        }
        else {
          //set event post data into form
          titleContainer.innerHTML = event.title.rendered;
          priceContainer.innerHTML = event.meta.event_price;
          contentContainer.innerHTML = event.raw_excerpt

          eventDescription.classList.remove('loading');

        }
      })
      .catch(error => {
        console.error(error)
      });
    }

  })

  
  //RENDER EVENTS
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
