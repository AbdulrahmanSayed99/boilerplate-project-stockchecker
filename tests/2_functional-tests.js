const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test ("Viewing one stock: GET request to /api/stock-prices/", function(done){chai.request(server)
        .get("/api/stock-prices/")
        .set("content-type", "application/json")
        .query({stock: "TSLA"})
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.exists(res.body.stockData.price, "TSLA has a price");
            done();
        })})


        test ("Viewing one stock and liking it : GET request to /api/stock-prices/", function(done){chai.request(server)
            .get("/api/stock-prices/")
            .set("content-type", "application/json")
            .query({stock: "TSLA", like: true})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.exists(res.body.stockData.price, "TSLA has a price");
                assert.equal(res.body.stockData.likes, 2)
                done();
            })})    



        
            test ("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function(done){chai.request(server)
                .get("/api/stock-prices/")
                .set("content-type", "application/json")
                .query({stock: "TSLA", like: true})
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.exists(res.body.stockData.price, "TSLA has a price");
                    assert.equal(res.body.stockData.likes, 2)
                    done();
                })})    


                
        test ("Viewing two stocks: GET request to /api/stock-prices/", function(done){chai.request(server)
            .get("/api/stock-prices/")
            .set("content-type", "application/json")
            .query({stock: ["TSLA", "GOLD"]})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData[0].stock, "TSLA")
                assert.equal(res.body.stockData[1].stock, "GOLD")
                assert.exists(res.body.stockData[0].price, "TSLA has a price");
                assert.exists(res.body.stockData[1].price, "GOLD has a price");
                done();
            })})    


            test ("Viewing two stocks and liking them: GET request to /api/stock-prices/", function(done){chai.request(server)
                .get("/api/stock-prices/")
                .set("content-type", "application/json")
                .query({stock: ["TSLA", "GOLD"], like: true})
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData[0].stock, "TSLA")
                    assert.equal(res.body.stockData[1].stock, "GOLD")
                    assert.exists(res.body.stockData[0].price, "TSLA has a price");
                    assert.exists(res.body.stockData[1].price, "GOLD has a price");
                   assert.exists(res.body.stockData[0].rel_likes, "has rel_likes");
                   assert.exists(res.body.stockData[1].rel_likes, "has rel_likes");
                    done();
                })})    
});
