const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const publishable_key = "pk_test_51HtVA1LrrJMhG10eAJdGQbn41DeqEKtXgq4vD9FfwrVDIXUIiTyue9sqOA2zq8Q64PuqxWnJa9KCNyZx7iEQIATl00fMoPhz7h";
const secret_key = "sk_test_51HtVA1LrrJMhG10eqRlBAmsbrDedqV6YaVl12sbpRehhJxY6818QpKtPPl0BMZuTt75irp4PFawuIJ2LiKOVzT0a00t8jlpdW0";

const stripe =  require('stripe')(secret_key);

const port = process.env.PORT || 3005;

// to recognize incoming request object as array or object.
// this middleware will parsed all request objects as array or objects.
app.use(bodyParser.urlencoded({extended:false}));
// returns middleware that only parsed json requests
app.use(bodyParser.json());

// View Engine Setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('Home', {
        key:publishable_key
    });
});

app.post('/payment', async (req, res) => {
    // The details that we take from user will pass here.
    const createdCustomer = await stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
        name:'test',
        address: { 
            line1: 'TC 9/4 Old MES colony', 
            postal_code: '452331', 
            city: 'Indore', 
            state: 'Madhya Pradesh', 
            country: 'India', 
        }
    }).then( async (customer) => {
        console.log('new customer created');
        const chargedCustomer = await stripe.charges.create({
            amount: 25000,
            description: 'Web test product',
            currency: 'INR',
            customer: customer.id
        });
        console.log('chargedcustomer ', chargedCustomer);
    }).then( charge => {
        console.log('charge ==>', charge);
        res.send('success');
    }).catch((err)=>{
        console.log('gateway error ==>', err);
        res.send(err);
    });
    console.log('createdcustomer ', createdCustomer);
})

app.listen(port, (err) => {
    if(err){
        throw err;
    }
    console.log('server is listening on port ', port);
})