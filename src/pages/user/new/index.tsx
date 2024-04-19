import Boilerplate from "@/app/components/boilerplate";
import Singup from "@/app/components/singup";
import '@/app/globals.css';

const NewUserPage = () => {

    return (
        <div className="dialog" id="dialog">
          <div className="card w-full p-0">
            <div className="card-body w-full p-0">
                <Singup />                   
      
                <div>
                    <Boilerplate />
                </div> 
      
            </div>
          </div>
        </div>
    );
}

export default NewUserPage