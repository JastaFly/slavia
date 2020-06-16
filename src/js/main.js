let modal = document.getElementsByClassName('modal-window');
let header = document.getElementsByTagName('header')[0];
let main = document.getElementsByTagName('main')[0];
let footer = document.getElementsByTagName('footer')[0];
let shadow = document.getElementsByClassName('shadow')[0];
let sliders = document.getElementsByClassName('product-slider');
let mobile_sliders = document.getElementsByClassName('mobile-slider');
let window_number;
let purchases_array = new Array();
let modal_container = modal[1].children[4];
let message = document.createElement('p');
let what_message;
message.className = 'modal-window__alert';
message.innerHTML = 'Товары не выбраны';

$(document).ready(function () {
    $(".product-slider").owlCarousel({
        items: 1,
        loop: true,
        dots: true
    });
    $(".slider-new").owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        dots: false
    });
    $(".mobile-slider").owlCarousel({
        items: 1,
        loop: true,
        dots: true
    });
    for (let i = 0; i < sliders.length; i++) {
        let dots = sliders[i].children[2].children;
        for (let k = 0; k < dots.length; k++) {
            let dot_span = dots[k].children[0];
            dot_span.innerHTML = k + 1;
        }
    }
    for (let i = 0; i < mobile_sliders.length; i++) {
        let dots = mobile_sliders[i].children[2].children;
        for (let k = 0; k < dots.length; k++) {
            let dot_span = dots[k].children[0];
            console.log(dot_span);
            dot_span.innerHTML = k + 1;
        }
    }
});

$('form').submit(function () {
    let name = this.name.value;
    let number;
    let message;
    let data;
    let window_form = this.hasAttribute('modal');
    let file_form = this.hasAttribute('file');
    console.log(file_form);
    let file;
    let header;
    let ready_date;
    if (file_form == true) {
        file = this.file.files[0];
        console.log(file);
        ready_date = new FormData();
        ready_date.append('file', file);
        header = 'application/x-www-form-urlencoded';
    } else {
        number = this.number.value;
        data = new Array();
        header = 'application/json';
        if (window_form == false) {
            message = this.message.value;
        } else {
            message = 'Сообщения нет';
        }
        data.push(name, number, what_message, purchases_array, message);
        ready_date = JSON.stringify(data);
    }
    fetch('../php/mail.php', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: ready_date
    })
        .then(response => response.text())
        .then(response => {
            console.log(response);
            if (window_form === true) {
                modal[window_number].style.display = 'none';
            }
            window_number = 2;
            $(modal[2]).slideToggle();
            shadow.style.display = 'block';
            delete_orders();
        })
});

let scene = document.getElementsByClassName('parallax')[0];
let parallaxInstance = new Parallax(scene);

const select = function (elem) {
    let cheked = elem.classList.contains('product__check_select');
    let block = elem.parentNode.parentNode;
    let count = elem.parentNode.parentNode.children[3].children[1];
    if (cheked == false) {
        elem.classList.add('product__check_select');
        block.classList.add('product_checked');
        count.innerHTML = 1;
    } else {
        elem.classList.remove('product__check_select');
        block.classList.remove('product_checked');
        count.innerHTML = 0;
    }
};
const count = function (elem, val) {
    let count = elem.parentNode.children[1];
    let now_val = parseInt(count.innerHTML);
    let block = elem.parentNode.parentNode;
    let select = block.children[0].children[1];
    if (now_val == 0 && val == -1) {
        val = 0;
    }
    count.innerHTML = now_val + val;
    now_val = parseInt(count.innerHTML);
    if (now_val > 0) {
        block.classList.add('product_checked');
        select.classList.add('product__check_select');
    } else if (now_val == 0) {
        block.classList.remove('product_checked');
        select.classList.remove('product__check_select');
    }
};

const change_product = function (number, elem) {
    let doble_button = elem.classList.contains('opacity-button_active');
    let screen_width = screen.width;
    let active;
    let select_slider;
    let active_class;
    if (doble_button == false) {
        if (screen_width > 568) {
            active = document.getElementsByClassName('product-slider_active');
            select_slider = sliders[number];
            active_class = 'product-slider_active';
        } else {
            active = document.getElementsByClassName('mobile-slider_active');
            select_slider = mobile_sliders[number];
            active_class = 'product-slider_active';
            active_class = 'mobile-slider_active';
        }
        $(select_slider).fadeIn(500);
        $(active[0]).fadeOut(500);
        active[0].classList.remove(active_class);
        select_slider.classList.add(active_class);
        let active_button = document.getElementsByClassName('opacity-button_active')[0];
        active_button.classList.remove('white-button', 'opacity-button_active');
        elem.classList.add('white-button', 'opacity-button_active');
    }

};
const add_new = function (elem) {
    let add = elem.classList.contains('new__select_add');
    if (add == false) {
        elem.classList.add('new__select_add');
    } else {
        elem.classList.remove('new__select_add');
    }
};
const add_file = function () {
    let file_input = document.getElementsByClassName('add-file')[0];
    file_input.click();
};
const show_window = function (number) {
    window_number = number;
    $(modal[window_number]).slideToggle();
    shadow.style.display = 'block';
    header.style.filter = 'blur(10px)';
    main.style.filter = 'blur(10px)';
    footer.style.filter = 'blur(10px)';
};
const close_window = function () {
    $(modal[window_number]).slideToggle();
    shadow.style.display = 'none';
    header.style.filter = 'blur(0)';
    main.style.filter = 'blur(0)';
    footer.style.filter = 'blur(0)';
};
const buy = function () {
    let purchases = document.getElementsByClassName('product_checked');
    if (purchases.length == 0) {
        modal_container.append(message);
    } else {
        for (let i = 0; i < purchases.length; i++) {
            let purchases_props = purchases[i].children;
            let props = new Array();
            props.push(purchases_props[1].innerHTML);
            props.push(purchases_props[2].innerHTML);
            props.push(purchases_props[3].children[1].innerHTML);
            purchases_array.push(props);
        }
        for (let j = 0; j < purchases_array.length; j++) {
            let order = document.createElement('div');
            order.className = 'order';
            order.setAttribute('number', j);
            // 1 колонка
            let col_1 = document.createElement('div');
            col_1.className = 'order__col';
            let name = document.createElement('p');
            name.className = 'order__title';
            name.innerHTML = purchases_array[j][0];
            let props = document.createElement('p');
            props.className = 'order__text';
            props.innerHTML = purchases_array[j][1];
            col_1.append(name, props);
            // 2 колонка
            let col_2 = document.createElement('div');
            col_2.className = 'order__col order__col_middle';
            let box = document.createElement('p');
            box.className = 'order__title';
            box.innerHTML = 'Коробки';
            let value = document.createElement('p');
            value.className = 'order__text';
            value.innerHTML = purchases_array[j][2] + ' шт';
            col_2.append(box, value);
            // 3 колонка
            let col_3 = document.createElement('div');
            col_3.className = 'order__col';
            col_3.innerHTML = '<img onclick="delete_good(this)" class="order__delete" src="./img/close.svg" alt="">';
            order.append(col_1, col_2, col_3);
            modal_container.append(order);
        }
    }
    $(modal[1]).slideToggle();
    window_number = 1;
    shadow.style.display = 'block';
    header.style.filter = 'blur(10px)';
    main.style.filter = 'blur(10px)';
    footer.style.filter = 'blur(10px)';
};
const delete_orders = function () {
    purchases_array = [];
    while (modal_container.firstChild) {
        modal_container.removeChild(modal_container.firstChild);
    }
};
const delete_good = function (elem) {
    let goods = elem.parentNode.parentNode;
    let array_item = goods.getAttribute('number');
    purchases_array.splice(array_item, 1);
    goods.remove();
    console.log(purchases_array);
    if (purchases_array.length == 0) {
        modal_container.append(message);
    }
};
const show_menu = function () {
    let menu = document.getElementsByClassName('ipad-nav');
    $(menu).slideToggle();
};

const buy_new = function () {
    console.log('dsdsdsds');
    let new_selected = document.getElementsByClassName('new__select_add');
    let new_name;
    let new_props;
    if (new_selected.length == 0) {
        modal_container.append(message);
    } else {
        for (let i = 0; i < new_selected.length; i++) {
            let props = new Array();
            let name = document.getElementsByClassName('new__select_add')[i].parentNode.parentNode.children[0].innerHTML;
            let prop = document.getElementsByClassName('new__select_add')[i].parentNode.parentNode.children[2].innerHTML;
            let val = 1;
            props.push(name, prop, val);
            purchases_array.push(props);
        }
        for (let j = 0; j < purchases_array.length; j++) {
            let order = document.createElement('div');
            order.className = 'order';
            order.setAttribute('number', j);
            // 1 колонка
            let col_1 = document.createElement('div');
            col_1.className = 'order__col';
            let name = document.createElement('p');
            name.className = 'order__title';
            name.innerHTML = purchases_array[j][0];
            let props = document.createElement('p');
            props.className = 'order__text';
            props.innerHTML = purchases_array[j][1];
            col_1.append(name, props);
            // 2 колонка
            let col_2 = document.createElement('div');
            col_2.className = 'order__col order__col_middle';
            let box = document.createElement('p');
            box.className = 'order__title';
            box.innerHTML = 'Коробки';
            let value = document.createElement('p');
            value.className = 'order__text';
            value.innerHTML = purchases_array[j][2] + ' шт';
            col_2.append(box, value);
            // 3 колонка
            let col_3 = document.createElement('div');
            col_3.className = 'order__col';
            col_3.innerHTML = '<img onclick="delete_good(this)" class="order__delete" src="./img/close.svg" alt="">';
            order.append(col_1, col_2, col_3);
            modal_container.append(order);
        }
    }
    $(modal[1]).slideToggle();
    window_number = 1;
    shadow.style.display = 'block';
    header.style.filter = 'blur(10px)';
    main.style.filter = 'blur(10px)';
    footer.style.filter = 'blur(10px)';
};
const what_fn = function (what) {
    switch (what) {
        case 1:
            what_message = 'Заказать звонок';
            break;
        case 2:
            what_message = 'Заказать продукцию на пробу';
            break;
        case 3:
            what_message = 'Сделать заказ';
            break;
        case 4:
            what_message = 'Заполнить бланк заявки на поставку';
            break;
        case 5:
            what_message = 'Получить новинку на пробу';
            break;
        case 6:
            what_message = 'Получить помощь с первым набором к поставке';
            break;
    }
    console.log(what_message);
};

const show_privacy = function () {
    $(modal[3]).slideToggle();
    window_number = 3;
    shadow.style.display = 'block';
    header.style.filter = 'blur(10px)';
    main.style.filter = 'blur(10px)';
    footer.style.filter = 'blur(10px)';
};

document.addEventListener('click', function(e) {
    let russia = document.getElementsByClassName('russia-map')[0];
        russia.style.pointerEvents = 'auto';
});