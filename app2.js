var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var path = require('path');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)

const exphbs = require('express-handlebars');

const hbs = exphbs.create({ extname: '.hbs' });


// Handlebars setup

// Serve static files (CSS, images) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure Express to use Handlebars as the view engine
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
 

 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url);
app.set('views', path.join(__dirname, 'views'));
var Sales = require('./models/sales');

app.get('/', function(req, res) {
    res.render('index', { title: 'Contents' });
  });

app.get('/api/Allsales', async (req, res) => {
    try {
        const sales = await Sales.find().lean();
        res.render('salesData', { sales }); 
    } catch (err) {
        console.error(err); 
        res.status(500).send('Error retrieving sales data');
    }
});

app.get('/api/Allsalesthunder', async (req, res) => {
    try {
        const sales = await Sales.find().lean();
        res.send(sales); 
    } catch (err) {
        console.error(err); 
        res.status(500).send('Error retrieving sales data');
    }
});


app.get('/api/sales/searchInvoiceno', (req, res) => {
    console.log('Reached /api/sales/new route');
    res.render('searchInvoice'); 
});

app.post('/api/sales/searchInvoiceno', async (req, res) => {
    try {
        const invoiceId = req.body.invoiceNo;
        const invoice = await Sales.findOne({ "Invoice ID": invoiceId }).lean();
        console.log(invoice);
        if (!invoice) {
            return res.status(404).send("Invoice not found");
        }

        res.render('SearchInvoiceResult',{invoice});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving invoice data');
    }
});

// Route to render the form for adding a new invoice
app.get('/api/sales/insert', (req, res) => {
    console.log('Reached /api/sales/new route');
    res.render('insert'); 
});

// Route to handle the submission of a new invoice
app.post('/api/sales/insert', async (req, res) => {
    try {
        
        const {
            invoiceId,
            branch,
            city,
            customerType,
            productLine,
            name,
            image,
            unitPrice,
            quantity,
            tax,
            total,
            date,
            time,
            payment,
            cogs,
            grossIncome,
            rating
            
        } = req.body;

        // Create a new Sale instance with the submitted data
        const newSale = new Sales({
            "Invoice ID": invoiceId,
            "Branch": branch,
            "City": city,
            "Customer type": customerType,
            "Product line": productLine,
            "name": name,
            "image": image,
            "Unit price": unitPrice,
            "Quantity": quantity,
            "Tax 5%": tax,
            "Total": total,
            "Date": date,
            "Time": time,
            "Payment": payment,
            "cogs": cogs,
            "gross income": grossIncome,
            "Rating": rating
            
        });

      
        await newSale.save();

        res.redirect('/api/Allsales'); 
    } catch (err) {
        console.error(err); 
        res.status(500).send('Error adding a new invoice');
    }
});


app.get('/api/sales', async (req, res) => {
    try {
        const invoices = await Sale.find();
        res.json({ invoices });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving invoice data');
    }
});

// Route to show a specific invoice by _id or invoiceID
app.get('/api/sales/:invoiceId', async (req, res) => {
    try {
        const invoiceId = req.params.invoiceId;
        const invoice = await Sales.findOne({ "Invoice ID": invoiceId });

        if (!invoice) {
            return res.status(404).send("Invoice not found");
        }

        res.json({ invoice });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving invoice data');
    }
});


// Route to insert a new invoice
app.post('/api/sales', async (req, res) => {
    try {
        const newSale = new Sales(req.body); 

        await newSale.save();

        res.status(201).json({ message: 'Invoice added successfully', newSale });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding a new invoice');
    }
});

// Route to delete an existing invoice by _id or invoiceID
app.delete('/api/sales/:invoiceId', async (req, res) => {
    try {
        const invoiceId = req.params.invoiceId;
        const deletedInvoice = await Sales.findOneAndDelete({ "Invoice ID": invoiceId });

        if (!deletedInvoice) {
            return res.status(404).send("Invoice not found");
        }

        res.json({ message: 'Invoice deleted successfully', deletedInvoice });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting the invoice');
    }
});



app.put('/api/sales/:invoiceId', async (req, res) => {
    try {
        const invoiceId = req.params.invoiceId;
        const { customerType, unitPrice } = req.body;

       
        if (!customerType || !unitPrice) {
            return res.status(400).send("Please provide both customerType and unitPrice for update");
        }

        const updatedInvoice = await Sales.findOneAndUpdate(
            { "Invoice ID": invoiceId }, 
            { $set: { "Customer type": customerType, "Unit price": unitPrice } }, 
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).send("Invoice not found");
        }

        return res.json({ message: 'Customer type and Unit price updated successfully', updatedInvoice });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error updating the invoice');
    }
});

app.listen(port);
console.log("App listening on port : " + port);



/******************************************************************************
***
* ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Vishal Student ID: N01546838 Date: 26-11-2023
*
*
******************************************************************************
**/ 