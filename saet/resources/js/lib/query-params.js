export default function(){
    return Object.fromEntries(new URLSearchParams(location.search));
}