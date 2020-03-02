import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage:image_url?", async ( req, res ) => {
    let imgUrl = req.query.image_url;

    const VALID_URL_REG_EX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g;

    //check imgUrl is not empty
    if(!imgUrl) {
      console.log("URL is empty");
      return res.status(400)
                .send('image url is required');
    }
    else
    {
      // validate imgUrl
      // compare it against our regex to see if its a valid url
      if(VALID_URL_REG_EX.exec(imgUrl))
      {
        const x = await filterImageFromURL(imgUrl);

        return res.status(201).sendFile(x, async (err) => {
          let fileArr = [];
          fileArr.push(x);
          deleteLocalFiles(fileArr);
        });
      }
      else
      {
        console.log('Not a URI');
        return res.status(400).send("not a valid url");
      }
    }
  });
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();