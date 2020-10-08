// File contains all operation of PouchDB database
import PouchDB from "pouchdb";

export default class database {
  constructor() {
    // create database and its object
    this.db = new PouchDB("POGO91");
  }

  //   provide database information
  async databaseinfo() {
    var res = await this.db.info(function(err, info) {
      if (err) {
        return err;
      } else {
        return info;
      }
    });
    return res;
  }

  //   add opration in document
  async addDatabase(doc) {
    var res = await this.db.put(doc, function(err, response) {
      if (err) {
        return err;
      } else {
        return response;
      }
    });
    return res;
  }

  //   update operation in document
  updateDatabaseProducts(doc) {
    var res = this.db
      .put(doc)
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  getLoginDetails() {
    var res = this.db
      .get("loginDetails")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  //   get data from productList document
  getDatabaseProducts() {
    var res = this.db
      .get("productList")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });

    return res;
  }

  getEditProducts() {
    var res = this.db
      .get("editProductList")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  getDatabaseUnpublishedProducts() {
    var res = this.db
      .get("productListUnpublish")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  getLastStoreInvoice() {
    var res = this.db
      .get("getLastStoreInvoice")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  getInvoiceList() {
    var res = this.db
      .get("invoiceList")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  getStorePayment() {
    var res = this.db
      .get("storePayment")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }


  getStoreInvoice() {
    var res = this.db
      .get("storeInvoice")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }
  getStoreInvoiceSettings() {
    var res = this.db
      .get("storeInvoiceSettings")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }


  getStoreSettings() {
    var res = this.db
      .get("storeSettings")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  getTax() {
    var res = this.db
      .get("getTax")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }
  getState() {
    var res = this.db
      .get("getState")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  getProductType() {
    var res = this.db
      .get("getProductType")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }
  deleteAddedProducts(rev) {
    var res = this.db
      .remove("addedProductList", rev)
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  //   get data from addeProductList document
  getAddedProducts() {
    var res = this.db
      .get("addedProductList")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

// get offline invoice data
  getOfflineProducts() {
    var res = this.db
      .get("offlineProductList")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  getProductForInvoice() {
    var res = this.db
      .get("productForInvoice")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  getHoldProducts() {
    var res = this.db
      .get("holdData")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  getDatabaseCustomers() {
    var res = this.db
      .get("customerList")
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  async deleteDoc(doc) {
    var res = await this.db
      .remove(doc)
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }

  // get all document in database
  async allDatabaseDocs() {
    var res = await this.db.allDocs(function(err, docs) {
      if (err) {
        return err;
      } else {
        return docs;
      }
    });
    return res;
  }

  //   destroy database
  async deleteDatabase() {
    var res = this.db
      .destroy()
      .then(function(response) {
        // handle response
        return response;
      })
      .catch(function(err) {
        return err;
      });
    return res;
  }
}
