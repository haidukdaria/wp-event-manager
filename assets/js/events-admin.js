document.addEventListener("DOMContentLoaded", function () {
  const mediaEndpoint = restApiSettings.root + "wp/v2/media"
  const eventsEndpoint = restApiSettings.root + "wp/v2/event"
  const nonce = restApiSettings.nonce

  const addForm = document.getElementById("admin-add-form")

  addForm &&
    addForm.addEventListener("submit", function (e) {
      e.preventDefault()
      console.log("submit")
      const formElements = e.target.elements

      //event post data
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
          //here
        })
        .catch((error) => {
          console.error(error)
        })
    })
})
