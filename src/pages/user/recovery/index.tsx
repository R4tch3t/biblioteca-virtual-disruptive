import Boilerplate from "@/app/components/boilerplate";
import Recovery from "@/app/components/recovery";
import '@/app/globals.css';

const RecoveryPage = () => {

    return (
        <div className="dialog" id="dialog">
          <div className="card w-full p-0">
            <div className="card-body w-full p-0">
                <Recovery />                   
      
                <div>
                    <Boilerplate />
                </div> 
      
            </div>
          </div>
        </div>
    );
}

export default RecoveryPage