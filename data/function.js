let heroes;

$.getJSON('hero.json',function (data){
    heroes = data;
    heroes = heroes.sort(e=>e.name)

    let clippedCookie;
    if(getCookie('clipped')!= null){
        clippedCookie = JSON.parse(getCookie('clipped'));
        let a =document.getElementById('active-container-container');
        a.classList.add('d-block')
        a.classList.remove('d-none')
    }else{
        clippedCookie = [];
    }
    for (var hero of data) {
     createHeroCard(hero,clippedCookie)
    }
});

function createHeroCard(hero,cookie){
    card = document.createElement("div");
    card.classList.add('card', 'border-0','bg-primary', 'mb-3')
    card.id = hero.name +'-card-container'

    createCardHeader(hero,card)
    createCardBody(hero,card)
    card.appendChild(cardBody)


    if(!cookie.includes(hero.name)){
        document.getElementById('hero-container').appendChild(card);
    }else{
        document.getElementById('active-container').appendChild(card);
    }

}

function debug(message){
    console.debug(message);
}

function createCardHeader(hero,card){
    cardheader = document.createElement('div');
    cardheader.classList.add('card-header','bg-primary','p-3','text-start');
    card.appendChild(cardheader)

    title = document.createElement("span");
    title.classList.add('card-text','text-white','user-select-none')
    title.id = hero.name + '-title-text'
    title.innerHTML = '<span class="float-end h4 m-0">'+ difToIcon(hero.difficulty,'★')+'</span> ' + hero.title;

    cardheader.setAttribute("onClick","foldCard('" +hero.name+"')")
    cardheader.appendChild(title);


}

function createCardBody(hero){
    cardBody = document.createElement('div');
    cardBody.classList.add('card-header','bg-secondary-subtle','p-3','mb-3','d-none');
    cardBody.id = hero.name + '-body-card';
    addActions(hero,cardBody);
    addStats(hero,cardBody);

    addSkills(hero,cardBody);

}
function addActions(hero,body){
    stats = document.createElement('div');
    stats.innerHTML = '<div class="w-100 text-center d-inline-block" style="height:50px">' +
        '<span style="  font-size: calc(2rem + 1.5vw) !important;" onClick="setToFavorite(\'' + hero.name + '\')">©</span>' +
    '</div>';
    body.appendChild(stats);

}

function addStats(hero,body){
    stats = document.createElement('div');
    stats.innerHTML = '<div class="text-center mb-3 user-select-none">' +
        listToString(hero.roles) + '<br><br>' +
        '<div class="d-flex text-center">' + createStatBox(hero,0)+ createStatBox(hero,1)+' </div>' +
        '<div class="d-flex text-center">' + createStatBox(hero,2)+ createStatBox(hero,3)+' </div>' +
        '<br><br>' +
        '<span class=" h2">Lore</span><br>'
        + hero.lore + '<br>' +
        '</div>';
    body.appendChild(stats);

}


function addSkills(hero,body){
    skillTable = document.createElement('div');
    skillTable.id = hero.name + '-skill-container';
    skillTable.classList.add('text-center')
    skillTable.innerHTML = '<span class=" h2">Cards</span><br><br>';
    for (let card of hero.cards.gold) {
        createCard(hero.name,card, 'gold',skillTable)
    }

    for (let card of hero.cards.silver) {
        createCard(hero.name,card, 'silver',skillTable)
    }

    makeSkillTree(hero.name,hero.cards.red,'red',skillTable)
    makeSkillTree(hero.name,hero.cards.blue,'blue',skillTable)
    makeSkillTree(hero.name,hero.cards.green,'green',skillTable)

    for (let card of hero.cards.ultimate) {
        createCard(hero.name,card, 'purple',skillTable)
    }

    body.appendChild(skillTable);
}

function makeSkillTree(name,cards,color,parent){
    colorTree = document.createElement('div');
    colorTree.classList.add('bg-dark-subtle', 'mb-3')
    for (let i = 0; i < 3 ; i++) {
        tierContainer = document.createElement('div');
        tierContainer.classList.add('d-flex');
        for (let j = 0; j < cards.length; j++) {
            if(cards[i][j] !== undefined){

                createCard(name,cards[i][j], color,tierContainer,i,j)
            }
        }
        colorTree.appendChild(tierContainer)

        parent.appendChild(colorTree)
    }
}

function createCard(name,card,color,parent,i,j) {
    skillcard = document.createElement('div');
    skillcard.classList.add('p-2','user-select-none');
    skillcard.id = name + '-' + color + checkNull(i+1,'-','') + checkNull(j+1,'-','');
    if(color === 'gold' || color === 'silver'){
        skillcard.classList.add('mb-3')

    }
    var c;
    switch (color){
        case 'red':
            c = 'bg-danger-subtle';
            break;
        case 'blue':
            c = 'bg-primary-subtle';
            break;
        case 'green':
            c = 'bg-success-subtle';
            break;
        case 'silver':
            c = 'bg-dark-subtle';
            break;
        case 'gold':
            c = 'bg-warning-subtle';
            break;
    }
    skillcard.classList.add(c);
    skillcard.style.border = '5px solid ' + color;
    skillcard.style.flex = 1;
    skillcard.innerHTML = makeCardContent(card,color);
    if(i =>1){
        skillcard.setAttribute("onClick","removeCardOption('" + skillcard.id+"')")
    }

    parent.appendChild(skillcard)
}

function makeCardContent(card,color){
    let s = '<span style="font-weight: bold">' + checkNull(card.initiative,'[',']' )+ ' '+ card.name + '</span><br>';
    if(card.actions !== undefined){
        if(card.actions.primary.parameter !== undefined){
            s += '<span>' + card.actions.primary.parameter[0].type + ' ' + card.actions.primary.parameter[0].value +'</span>';
            if(card.actions.primary.parameter[1] !== undefined){
                s += ' - <span>' + card.actions.primary.parameter[1].type + ' ' + card.actions.primary.parameter[1].value +'</span> <br>';
            }else{
                s+= ' <br>';
            }
        }
        s += '<span>' + card.actions.primary.effect +  '</span>';

        s += '<br><span style="opacity: 0.6">' + card.actions.secondary[0].type +' '+ checkNull(card.actions.secondary[0].value ) + '</span>';
        if(card.actions.secondary[1] !== undefined){
            s += '<span style="opacity: 0.6;">  / ' + card.actions.secondary[1].type +' '+ checkNull(card.actions.secondary[1].value ) +  '</span>';
        }
    }

    if(color === 'purple'){
        if(card.parameter !== undefined){
            for (let i = 0; i < card.parameter.length; i++) {
                s += '<span>' + card.parameter[i].type + ' ' + card.parameter[i].value +'</span><br>';
            }
        }
        s += '<span>' + card.effect +  '</span>';
    }

    return s;
}

//word gebruikt in de createHeroCard function
function foldCard(hero){
    let i = document.getElementById(hero + '-body-card');
    if(i !== null){
        if(i.classList.contains('d-none')){
            i.classList.add('d-block');
            i.classList.remove('d-none')
        }else{
            i.classList.remove('d-block');
            i.classList.add('d-none')
        }
    }
}

function checkNull(value,pre,post){
    if(value !== undefined){
        return checkNull(pre) + value + checkNull(post);
    }
    return '';
}

function removeCardOption(id){
    var option = id.slice(id.length - 1);
    var rank = id.slice(id.length-3).charAt(0)
    var tag = id.slice(0,id.length-3);


    for (let i = rank; i > 0; i--) {
        for (let j = 3; j > 0; j--) {
            if(id !== tag+i+'-'+j){
                if(document.getElementById(tag+i+'-'+j) !== null){
                    card = document.getElementById(tag+i+'-'+j);
                    card.classList.add('d-none');
                    card.classList.remove('d-block');
                }
            }
        }
    }
}

function listToString(list){
    var s ='';
    for (let role of list) {
        s+=  role + '\xa0\xa0\xa0'
    }
    return s;
}

function difToIcon(dif,icon){
    var s ='';
    for (let i = 0; i < dif ; i++) {
        s += icon
    }
    return s;
}

function createStatBox(hero,stat){
    box = document.createElement('div')
    box.innerHTML ="whatap";
    return '<div class="w-50 user-select-none">'+hero.stats[stat].stat+
         '<br>' + difToIcon(hero.stats[stat].value,'★') + difToIcon(hero.stats[stat].modifier,'☆') +
        '</div>'
}

function setToFavorite(hero){
    let heroCookie;
    if(getCookie('clipped') !== undefined){
        heroCookie = JSON.parse(getCookie('clipped'));
    }
    card = document.getElementById(hero + '-card-container');
    selector = '#' + hero + '-card-container'
    fave = document.getElementById('active-container')
    faveContainer = document.getElementById('active-container-container');
    if(fave.querySelector(selector) === null){
        if(getCookie('clipped') === null){
            let a = new Array(hero);
            setCookie('clipped', JSON.stringify(a),7)
        }else{
            heroCookie.push(hero);
            setCookie('clipped', JSON.stringify(heroCookie),7)
        }
        if(faveContainer.classList.contains('d-none')){
            faveContainer.classList.add('d-block')
            faveContainer.classList.remove('d-none')
        }
        fave.prepend(card);
    }else{
        if(heroCookie.length !== 1){
            heroCookie = heroCookie.filter(e=>e !== hero);
            setCookie('clipped', JSON.stringify(heroCookie),7)
        }else{
            if(heroCookie.includes(hero)){
                eraseCookie('clipped')
            }
        }

        heroc = document.getElementById('hero-container')
        heroc.prepend(card);
        if(!fave.hasChildNodes()){
            faveContainer.classList.remove('d-block')
            faveContainer.classList.add('d-none')
        }
    }
    foldCard(hero)

}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
