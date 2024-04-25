import "./header.css";

const Header: React.FC = () =>  {
  return (
    <div className="header">
      <div className="headerImgContainer">
        <img
          className="headerImg"
          src="https://scontent.fvvi1-1.fna.fbcdn.net/v/t1.15752-9/436765365_756754019641337_2151670818439115044_n.png?_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=fzd2BWE1iJkQ7kNvgHxOh5U&_nc_ht=scontent.fvvi1-1.fna&oh=03_Q7cD1QEVXOKYe9aGmzC2odSaEs4tLLqiVr5CDIWAZDgnpL6i3g&oe=66514835"
          alt=""
        />
      </div>
    </div>
  );
};

export default Header;
