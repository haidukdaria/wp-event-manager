document.addEventListener("DOMContentLoaded", function () {
  const mediaEndpoint = restApiSettings.root + "wp/v2/media"
  const eventsEndpoint = restApiSettings.root + "wp/v2/event"
  const nonce = restApiSettings.nonce

  const addEventForm = document.getElementById("admin-add-form")
  const eventListBody = document.getElementById("event-list-body")

  addEventForm &&
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

          //then update list on front
          return fetch(eventsEndpoint)
        })
        .then((res) => res.json())
        .then((data) => {
          console.log("Posts recieved: ", data)

          if (!eventListBody) {
            return
          }

          //then populate html
          let content = ""
          data.forEach((event) => {
            content += `<li class="events-list__row" data-event-id="${event.id}">
            <div class="events-list__row-cell events-list__row-cell--name">${event.title.rendered}</div>
            <div class="events-list__row-cell events-list__row-cell--price">${event.meta.event_price}$</div>
            <div class="events-list__row-cell events-list__row-cell--operations">
              <button class="events-list__btn events-list__btn--edit">Edit</button>
              /
              <button class="events-list__btn events-list__btn--delete">Delete</button>
            </div>
          </li>`
          })
          eventListBody.innerHTML = content

          //remove spinner, clear the form
          addEventForm.classList.remove('loading');
          addEventForm.reset();
        })
        .catch((error) => {
          console.error(error)
        })
    })
})
