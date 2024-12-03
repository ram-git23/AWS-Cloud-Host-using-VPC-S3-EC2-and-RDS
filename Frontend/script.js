let container = document.querySelector(".content");
let btn = document.querySelector("button");
let number = document.querySelector("#search");

btn.addEventListener("click", async () => {
  let val = number.value;
  let furl = await fetch("http://<ec2_public_ip>:5000/products");
  let response = await furl.json();
  console.log(response);
  drawBox(response, val);
});
//

function drawBox(response, value) {
  content = "";
  for (let index = 0; index < value; index++) {
    const val = response[index % 10];
    content += `<div class="box">
          <img
            src="${val.src}" alt=""
          />
          <p>${val.name}</p>
        </div>`;
    if (index == value - 1) {
      break; // Now 'break' works properly
    }
  }
  container.innerHTML = content;
}
