import { useStorage } from "../Storage/StorageProvider";

export default function DarkToggle() {
  const {setDark} = useStorage();
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    const darkButtonToggelLogo = document.querySelector('.darkButtonToggelLogo') || new HTMLElement();
    setDark((prev:any)=>{ return !prev });
    if(document.documentElement.classList.contains("dark")){
      // darkButtonToggelLogo.classList.remove('bi-sun-fill')
      // darkButtonToggelLogo.classList.add('bi-moon-stars-fill')
      darkButtonToggelLogo.classList.replace('bi-moon-stars-fill', 'bi-sun-fill')
    }else{
      // darkButtonToggelLogo.classList.remove('bi-moon-stars-fill')
      // darkButtonToggelLogo.classList.add('bi-sun-fill')
      darkButtonToggelLogo.classList.replace('bi-sun-fill', 'bi-moon-stars-fill')
    }
  };
  return (
    <div className="darkDarkTogelBtn text-gray-900 dark:text-white">
      <button className="" onClick={toggleDarkMode}>
        <i className="darkButtonToggelLogo bi bi-moon-stars-fill"></i>
      </button>
    </div>
  );
}