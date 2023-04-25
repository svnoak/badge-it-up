export default function saveBadgeInLocalStorage(badges: any, oid: string) {
  const localStorageObject = JSON.parse(localStorage.getItem(oid) as string);
  
  localStorageObject .badges = badges;

  const localStorageString = JSON.stringify(localStorageObject );

  localStorage.setItem(oid, localStorageString);
}

