import React, {useState} from "react";
import axios from "axios";
import './App.scss';

function App() {
  const [id, setID] = useState("");

  const [active, setActive] = useState("all");

  const [token, setToken] = useState("");

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

  return(
    <div className="home">
      <h2>Filter Phone Number Of A Post In Facebook</h2>

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
