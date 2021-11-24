public with sharing class Manager {
    public Manager() {

    }

    @AuraEnabled
    public static String getAllProducts() {
        return JSON.serialize([ SELECT Id, Name, Description, Price__c, Quantity__c
                                FROM Product2 
                                WHERE Quantity__c>0]);
    } 

    @AuraEnabled
    public static String getAllPurchases() {
        return JSON.serialize([ SELECT Id,Name, Price__c, ProductId__c, UserId__c, Num__c FROM Purchase__c  WHERE UserId__c=:UserInfo.getUserID()]);
    }

    @AuraEnabled
    public static String getOneProduct(String idDetail) {
        List<Product2> l1=[ SELECT Id, Name, Description, Price__c, Quantity__c, Color__c, Dimension__c, Rating__c, Size__c
                            FROM Product2 
                            WHERE Id=:idDetail];

        return JSON.serialize(l1[0]);
    } 

    @AuraEnabled
    public static String getTwoProducts(String idDetail) {
        List<Product2> l1=[ SELECT Id, Name, Description, Price__c, Quantity__c, Color__c, Dimension__c, Rating__c, Size__c
                            FROM Product2 
                            WHERE Id!=:idDetail
                            LIMIT 2];

        return JSON.serialize(l1);
    } 

    @AuraEnabled
    public static String buyProducts(List<String> ids) {
        List<Product2> l1=[ SELECT Id, Name, Description, Price__c, Quantity__c
                                FROM Product2 
                                WHERE id IN :ids];

        List<Purchase__c> l2=new List<Purchase__c>();
                                
        Map<String,Purchase__c> searchMap = new Map<String,Purchase__c>();
        for(Purchase__c p :[ SELECT Id, Price__c, Name, ProductId__c, UserId__c, Num__c FROM Purchase__c  WHERE ProductId__c IN :ids AND UserId__c=:UserInfo.getUserID()])
        {
            if(!searchMap.containsKey(p.ProductId__c)){
                searchMap.put(p.ProductId__c,p);
            }
        }

        if(l1.size()>0){
            for(Product2 p : l1)
            {
                if(searchMap.containsKey(p.Id)){
                    Purchase__c pc=  searchMap.get(p.Id);
                    if(pc.Num__c<p.Quantity__c){
                        pc.Num__c++;
                        pc.Price__c=p.Price__c;
                        pc.Name=p.Name;
                        l2.add(pc);
                    }
                }
                else {
                    Purchase__c pc=new Purchase__c();
                    pc.UserId__c=UserInfo.getUserID();
                    pc.Num__c=1;
                    pc.ProductId__c=p.Id;
                    pc.Name=p.Name;
                    pc.Price__c=p.Price__c;
                    //searchMap.put(p.Id,pc);
                    l2.add(pc);
                }
            }
            upsert l2;
        }
        return JSON.serialize([ SELECT Id, Name, Description, Price__c, Quantity__c
                                FROM Product2
                                WHERE Quantity__c>0]);
    } 

    @AuraEnabled
    public static String buyProduct(List<String> ids) {
        List<Product2> l1=[ SELECT Id, Name, Description, Price__c, Quantity__c
                                FROM Product2 
                                WHERE id IN :ids];

        List<Purchase__c> l2=new List<Purchase__c>();
                                
        Map<String,Purchase__c> searchMap = new Map<String,Purchase__c>();
        for(Purchase__c p :[ SELECT Id,Price__c,Name, ProductId__c, UserId__c, Num__c FROM Purchase__c  WHERE ProductId__c IN :ids AND UserId__c=:UserInfo.getUserID()])
        {
            if(!searchMap.containsKey(p.ProductId__c)){
                searchMap.put(p.ProductId__c,p);
            }
        }

        if(l1.size()>0){
            for(Product2 p : l1)
            {
                if(searchMap.containsKey(p.Id)){
                    Purchase__c pc=  searchMap.get(p.Id);
                    if(pc.Num__c<p.Quantity__c){
                        pc.Num__c++;
                        pc.Price__c=p.Price__c;
                        pc.Name=p.Name;
                        l2.add(pc);
                    }
                }
                else {
                    Purchase__c pc=new Purchase__c();
                    pc.UserId__c=UserInfo.getUserID();
                    pc.Num__c=1;
                    pc.ProductId__c=p.Id;
                    pc.Name=p.Name;
                    pc.Price__c=p.Price__c;
                    //searchMap.put(p.Id,pc);
                    l2.add(pc);
                }
            }
            upsert l2;
        }
        List<Product2> l3=[ SELECT Id, Name, Description, Price__c, Quantity__c, Color__c, Dimension__c, Rating__c, Size__c
                            FROM Product2 
                            WHERE id IN :ids];

        return JSON.serialize(l3[0]);
    } 

    @AuraEnabled
    public static String finalBuy() {
        List<Purchase__c> l1=[ SELECT Id,Name, ProductId__c, UserId__c, Num__c FROM Purchase__c  WHERE UserId__c=:UserInfo.getUserID()];

        List<Product2> l2=new List<Product2>();
                                
        Map<String,Product2> searchMap = new Map<String,Product2>();
        for(Product2 p :[    SELECT Id, Name, Description, Price__c, Quantity__c
                                FROM Product2 ])
        {
            if(!searchMap.containsKey(p.Id)){
                searchMap.put(p.Id,p);
            }
        }

        if(l1.size()>0){
            for(Purchase__c pc : l1)
            {
                if(searchMap.containsKey(pc.ProductId__c)){
                    Product2 p=  searchMap.get(pc.ProductId__c);
                    p.Quantity__c--;
                    l2.add(p);
                }
            }
            update l2;
            delete l1;
        }
        return JSON.serialize([ SELECT Id,Name, ProductId__c,Price__c, UserId__c, Num__c FROM Purchase__c  WHERE UserId__c=:UserInfo.getUserID()]);
    } 

    @AuraEnabled
    public static String empty() {
        List<Purchase__c> l1=[ SELECT Id,Name, ProductId__c, UserId__c, Num__c FROM Purchase__c  WHERE UserId__c=:UserInfo.getUserID()];

        if(l1.size()>0){
            delete l1;
        }
        return JSON.serialize([ SELECT Id,Name, ProductId__c,Price__c, UserId__c, Num__c FROM Purchase__c  WHERE UserId__c=:UserInfo.getUserID()]);
    } 
}
