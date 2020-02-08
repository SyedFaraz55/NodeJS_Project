let button = document.querySelector('.button');
button.addEventListener('click',function(e){
  e.preventDefault();
  document.querySelector('.bg-modal').style.display = 'flex';
});
let close = document.querySelector('#close');
close.addEventListener('click',function(e){
  document.querySelector('.bg-modal').style.display = 'none';
})
