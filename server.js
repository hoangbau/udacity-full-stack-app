import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  const urlImageRegex = new RegExp('(https?:\/\/.*\.(?:png|jpg|jpeg))')

  app.get("/filteredimage", async (req, res) => {
    try {

      const {image_url}  = req.query
      //  1. validate the image_url query

      if(!image_url)
      {
        res.status(400).send("Image Url Can Not Be Null Or Empty")
      }

      const checkUrl = image_url.match(urlImageRegex)

      if(!checkUrl){
        res.status(400).send("Image Url Wrong Format")
      }

      //  2. call filterImageFromURL(image_url) to filter the image
      const filteredPath = await filterImageFromURL(image_url);

      //  3. send the resulting file in the response
      res.status(200).sendFile(filteredPath, () => {
      //  4. deletes any files on the server on finish of the response
        deleteLocalFiles([filteredPath]);
      })
    } catch (error) {
      res.status(500).send("Oops something went wrong!!!!")
    }
  })

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
