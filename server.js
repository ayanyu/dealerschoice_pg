
const { client, syncAndSeed } = require('./db')

const path = require('path')

const express = require('express');
const app = express();

app.get('/', async(req, res, next)=> {
    try {
        const response = await client.query('SELECT * FROM brand;');
      const brand = response.rows;
      res.send(`
        <html>
        <head>
        <h1> Makeup Store </h1>
        </head>
          <body>
          <h3>Brands</h3>
            <ul>
              ${
                brand.map( brands => {
                  return `
                    <li>
                      <a href='/brands/${brands.id}'>
                        ${ brands.name }
                      </a>
                    </li>
                  `;
                }).join('')
              }
            </ul>
          </body>
        </html>
      `);
    }
    catch(ex){
      next(ex);
    }
  });


const createBrand = async(name)=> {
    return (await client.query(`
    INSERT INTO brand(name) values($1) returning *
    `, [name])).rows[0];
  };

  const getBrands = async()=> {
    return (await client.query('SELECT * from brand')).rows;
  };

  const getBrand = async(id)=> {
    const response = await client.query('SELECT * FROM brand WHERE id = $1', [id]);
    return response.rows[0];
  };

  app.get('/brands/:id', async(req, res, next)=> {
    try {
        let response = await client.query('SELECT * FROM brand WHERE id = $1;', [req.params.id]);
        const brands = response.rows[0];
         response = await client.query('SELECT * FROM cosmetic WHERE brand_id = $1;', [req.params.id]);
        const cosmetic = response.rows;
      res.send(`
        <html>
        <head>
        </head>
          <body>
          <h1> Makeup Store </h1>
          <h3><a href="/">Brands</a> (${ brands.name }) </h3>
            <ul>
             ${
                 cosmetic.map( cosmetics => `
                    <li>
                    ${ cosmetics.name }

                    </li>
                 `).join('')
             }
            </ul>
          </body>
        </html>
      `);
    }
    catch(ex){
      next(ex);
    }
  })

const port = process.env.PORT || 3000;


const start= async() => {
    try{
        await client.connect();
        await syncAndSeed();
        console.log('connected to database ');
        app.listen(port, ()=> console.log(`listening on port ${port}`));
    }
    catch(ex){
        console.log(ex)
    }
};

start();