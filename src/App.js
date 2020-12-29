import React, {useState} from "react";
import axios from "axios";
import './App.scss';

function App() {
  const [id, setID] = useState("100011738775535_1188088838259064");

  const [active, setActive] = useState("all");

  const [randomNumber, setRandomNumber] = useState();

  const [randomText, setRandomText] = useState("Random");

  const [token, setToken] = useState("EAABwzLixnjYBAIEp8DrIZCHsYqPdWMYZCFFc0ZB30QiJMBu4U03FPkZChGpLQFLOzaD3ZBn0SZAVsjQnzZB2OQC803ekjIUapAELcWe59imAHqSZCRnmAeg8AyOr7g3mPIR1kpGGulqCSFMBvl09iOdWK9DtaJ4M8MqRK1eIEZAmdpx5ev9eu89RZAdvWG3o2vuowZD");

  const [comments, setComments] = useState([]);

  const handerSubmit = async(e) =>{
    e.preventDefault();

    setActive("all");

    let res = await axios.get(`https://graph.facebook.com/${id}/comments?fields=from{name,id,username,link, picture},created_time,message&access_token=${token}`);

    setComments(res.data.data);
  }

  const filterPhoneNumber = () =>{
    setActive("phone");

    let result = [];
    comments.map((phone)=>{
      if(phone.message.match(/(09|03|07|08|05)+([0-9]{8})/g)){
        return result.push(phone);
      }
      return 0;
    });

    setComments(result);
  }

  const tableView = () =>{
    setActive("table");

    let result = [];

    comments.map((phone)=>{
      if(phone.message.match(/(09|03|07|08|05)+([0-9]{8})/g)){
         phone.message = phone.message.match(/(09|03|07|08|05)+([0-9]{8})/g)[0];
         return result.push(phone);
      }
      return 0;
    });

    setComments(result);
  }

  const generateRandomNumber =(e)=>{
    e.preventDefault();
    if(randomText === "Random"){
      setRandomText("Clear")
      setRandomNumber(Math.floor(Math.random() * 100));
    }else{
      setRandomNumber("");
      setRandomText("Random");
    }
  }

  return(
    <div className="home">
      <h2>Filter Phone Number Of A Post In Facebook</h2>
      <div className="random">{randomNumber}</div>

      <div className="container">
        <form>
          <div className="form-group">
            <label>ID(user, page)</label>
            <input type="text" name="setID" value={id} onChange={(e)=> setID(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Access Token</label>
            <input type="text" name="setToken" value={token} onChange={(e)=> setToken(e.target.value)} />
          </div>

          <button type="submit" onClick={(e)=>handerSubmit(e)}>Filter</button>

          <button className="btn-random" onClick={(e)=>generateRandomNumber(e)}>{randomText}</button>
        </form>

        <div className="wrapper-comments">
          <div className="header">
            <button className={active === "all" ? "active" : ""} onClick={(e)=>handerSubmit(e)}>All</button>

            <button className={active === "phone" ? "active" : ""} onClick={()=>filterPhoneNumber()}>Phone</button>

            <button className={active === "table" ? "active" : ""} onClick={()=>tableView()}>Table View</button>
          </div>

          <div className="comments">
            {
              active === "table" ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        comments.map((comment)=>(
                          <tr key={comment.id}>
                            <td>{comment.from.name}</td>
                            <td><a href={`tel:${comment.message}`}>{comment.message}</a></td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
              ): (
                comments.map((comment)=>(
                  <div className="comment-item" key={comment.id}>
                    <img src={comment?.from?.picture?.data?.url} alt=""/>
        
                    <div className="user">
                      <label>{comment.from.name}</label>
                      <p>{comment.message}</p>
                    </div>
                  </div>
                ))
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
