// popup 출석체크 완료 체크 애니메이션
let completeCheck = document.querySelector('.ani_complete_check');
let animation = bodymovin.loadAnimation({
  container : completeCheck,
  path : 'https://lottie.host/691a98a9-8d82-4493-9704-18f089db11b0/fe9bbJ9K3D.json',
  renderer : 'svg',
  loop : false, //반복재생
  autoplay : true //자동재생  
  //animationData :animationData // 직접 객체정보를 넣거나
});