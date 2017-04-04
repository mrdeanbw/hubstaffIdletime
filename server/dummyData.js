import User from './models/user';
import Role from './models/role';
import Account from './models/account';
import cuid from 'cuid';

export default function () {  
  
  // Update account
  // Account.findOne({ email: 'xmetalced@gmail.com' }).exec((error, account) => {
  //   if (error) {
  //     console.log("Error retrieving Account!!");
  //   }
  //   else {
  //     User.findOneAndUpdate({ email: 'tcheutchouasteve@gmail.com' }, {password: 'krankbuzz2016', accounts: [account]}).exec((err, saved) => {
  //       console.log(err);
  //       console.log(saved);
  //     });
  //   }
  // });

  // Create Account
  // const account = new Account({email: 'baris.k.005@gmail.com', password: 'CityU2011', cuid: cuid()});

  //   Account.create([account], (error) => {
  //   if (!error) {
  //     console.log('Created new Accounts....');
  //   }
  //   else {
  //     console.log(error);
  //   }
  // });

  User.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    const role1 = new Role({ name: 'Admin' });
    const role2 = new Role({ name: 'Manager' });

    Role.create([role1, role2], (error) => {
      if (!error) {
        console.log('Created roles....');
      }
    });

    const account1 = new Account({email: 'ralphwantek@gmail.com', password: '03xqlsRP61mcNqm', cuid: cuid()});
    const account3 = new Account({email: 'ziahamza.ust@gmail.com', password: 'Test123', cuid: cuid()});
    const account5 = new Account({email: 'kennethau82@gmail.com', password: 'UdacityForever', cuid: cuid()});
    const account7 = new Account({email: 'madeius@icloud.com', password: '123456789', cuid: cuid()});
    const account8 = new Account({email: 'xmetalced@gmail.com', password: 'krankbuzz2016', cuid: cuid()});
    const account9 = new Account({email: 'jiangyuan916@gmail.com', password: '2016MakeThingsHappen', cuid: cuid()});
    const account10 = new Account({email: 'hsiangl.cmu@gmail.com', password: 'hsiangl@CMU', cuid: cuid()});
    const account11 = new Account({email: 'cfcdavidchan@gmail.com', password: '25570743', cuid: cuid()});
    const account12 = new Account({email: 'paterne.tchoussi@gmail.com', password: '123456789', cuid: cuid()});
    const account13 = new Account({email: 'baris.k.005@gmail.com', password: 'CityU2011', cuid: cuid()});

     Account.create([account1, account3,
                    account5, account7, account8,
                    account9, account10, account11, account12,
                    account13], (error) => {
      if (!error) {
        console.log('Created Initial Accounts....');
      }
      else {
        console.log(error);
      }
    });



    const users = [ new User({ name: 'Admin', email: 'admin@adipster.com', password: 'Ats@1234', roles:[role1, role2], cuid: cuid(), accounts:[account11] }),
                    new User({ name: 'Jean-Marc Ntepp', email: 'ntepp.marcus@gmail.com', password: '03xqlsRP61mcNqm', cuid: cuid(), accounts:[account1] }),
                    new User({ name: 'Valdes Foko', email: 'research.ciffer@gmail.com', password: '03xqlsRP61mcNqm', cuid: cuid(), accounts:[account1] }),
                    new User({ name: 'Martial Naoussi', email: 'kuitcheiselin@gmail.com', password: 'Test123', cuid: cuid(), accounts:[account3] }),
                    new User({ name: 'Eugene Egbe Agbor', email: 'agboreugene@gmail.com', password: 'Test123', cuid: cuid(), accounts:[account3] }),
                    new User({ name: 'Reza Chu', email: 'rezachu@gmail.com', password: 'UdacityForever', cuid: cuid(), accounts:[account5] }),
                    new User({ name: 'Newton Nkeng', email: 'newtnnkeng@gmail.com', password: 'UdacityForever', cuid: cuid(), accounts:[account5] }),
                    new User({ name: 'Ivan Ngong', email: 'ngongivan@gmail.com', password: '123456789', cuid: cuid(), accounts:[account7] }),
                    new User({ name: 'Ivoline Ngong', email: 'ivolinengong@gmail.com', password: 'krankbuzz2016', cuid: cuid(), accounts:[account8] }),
                    new User({ name: 'Kevin Larry', email: 'kevinlarry53@gmail.com', password: '2016MakeThingsHappen', cuid: cuid(), accounts:[account9] }),
                    new User({ name: 'Olouge Eya Ekolle', email: 'olongel92@gmail.com', password: 'hsiangl@CMU', cuid: cuid(), accounts:[account10] }),
                    new User({ name: 'Ulrich Tchuenkam', email: 'ulrichmobi2@gmail.com', password: '25570743', cuid: cuid(), accounts:[account11] }),
                    new User({ name: 'Steve Tcheutchoua', email: 'tcheutchouasteve@gmail.com', password: '123456789', cuid: cuid(), accounts:[account12] }),
                    new User({ name: 'Rocard Fonkeng', email: 'fonkengrocard@gmail.com', password: 'CityU2011', cuid: cuid(), accounts:[account13] }),
    ]

    User.create(users, (error) => {
      if (!error) {
        console.log('Created Initial users....');
      }
      else {
        console.log(error);
      }
    });
  });  
  
}
