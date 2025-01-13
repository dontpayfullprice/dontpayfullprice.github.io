async function getcoupons ()
{
    jQuery.get('data/admitad_coupons_string', function(data) {
        xmlstr = data;
    });
}
function stripHtml(html)
{
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}


function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

//xmlstr =  getcoupons ()

function search_coupons()
{

    chosen_category = document.querySelector("#categories").selectedIndex ;
    chosen_merchant = document.querySelector("#merchants").selectedIndex ;

    chosen_category_value = document.querySelector("#categories").selectedOptions[0].innerText  ;
    chosen_merchant_value = document.querySelector("#merchants").selectedOptions[0].innerText ;



    showed_categories = [];
    showed_merchants = [];


    // search
    obj = JSON.parse(xmlstr);

    query = document.getElementsByClassName('input-box')[0].children[0].value.toLowerCase();


    if ( document.getElementById('promok').checked == true )
        promokod = true;
    else
        promokod = false;

    // clear screen
    document.getElementById('mainbox').innerHtml='';

    // add info searched
    mainboxhtml = '';

    for ( i = 0; i< obj.length; i++ )
    {


        showed_merchants.push ( obj[i].campaign.name );

        for (  m = 0 ; m < obj[i].categories.length ; m++ )
            showed_categories.push ( obj[i].categories[m].name );

        if ( obj[i].promocode != null )
            obj[i].promocode = obj[i].promocode.toLowerCase();
        else
            obj[i].promocode = 'not required';


        if (obj[i].promocode != '' && obj[i].promocode.toLowerCase() != 'not required' && obj[i].promocode.toLowerCase() != 'none' && obj[i].promocode.toLowerCase() != 'не требуется')
            pr_code = 'Promo code: ' + obj[i].promocode;
        else
            pr_code = '';

        if ( promokod == true && obj[i].promocode.toLowerCase() == 'not required' )
            continue;

        if ( chosen_category != "0" && obj[i].categories.includes( chosen_category_value ) != true )
        {
            //console.log (chosen_category_value);
            //console.log (obj[i].couponcategory);
            continue;
        }

        if ( chosen_merchant != "0" && obj[i].campaign.name != chosen_merchant_value )
        {
            continue;
        }
        if ( promokod == true && obj[i].promocode != '' )
        {

            if ( obj[i].description == null )
                obj[i].description = '';

            if ( obj[i].short_name == null )
                obj[i].short_name = '';

            if ( obj[i].discount != null )
                discount = 'Discount: ' + obj[i].discount;
            else
                discount = '';

            if ( obj[i].description.toLowerCase().includes(query) || obj[i].campaign.name.toLowerCase().includes(query) ||  obj[i].promocode.toLowerCase().includes(query) || obj[i].short_name.toLowerCase().includes(query)  )
            {
                //console.log (obj[i]);
                //console.log (obj[i].description);
                //console.log ( obj[i].regions )
                //console.log ( obj[i].frameset_link )
                //console.log ( obj[i].url );
                //console.log ( obj[i].code );
                //showed_merchants.push ( obj[i].merchantname );
                //showed_categories.push ( obj[i].couponcategory );
                //merchantid = obj[i].tagging_ads;
                //mainboxhtml = mainboxhtml + '<div class="card"><img src="' + obj[i].logo + '" alt="" /><h1><a href="' + obj[i].url + '">' + obj[i].merchantname + '</a></h1><p>' + obj[i].description + '</p><p class="tag_ad">' + obj[i].tagging_ads + '</p><p class="code">Промокод: ' + pr_code + '</p></div>';
                mainboxhtml = mainboxhtml + '<div class="card"><img src="/logos/' + obj[i].campaign.id + '.webp" alt="" /><h1><a href="' + obj[i].goto_link + '">' + obj[i].campaign.name + '</a></h1><p>' + stripHtml(obj[i].short_name) + '</p><p class="code"><a href="' + obj[i].goto_link + '">' + pr_code + '</a></p><p class="discount">' + discount + '</p></div>';

            }
        }
        else
        {
            if ( obj[i].description == null )
                obj[i].description = '';

            if ( obj[i].description.toLowerCase().includes(query) || obj[i].campaign.name.toLowerCase().includes(query) ||  obj[i].promocode.toLowerCase().includes(query) ||obj[i].short_name.toLowerCase().includes(query)  )
            {
                //console.log (obj[i]);
                //console.log (obj[i].description);
                //console.log ( obj[i].regions )
                //console.log ( obj[i].frameset_link )
                //console.log ( obj[i].url );
                //merchantid = obj[i].tagging_ads;
                //console.log ( obj[i].code );
                //showed_merchants.push ( obj[i].merchantname );
                //showed_categories.push ( obj[i].couponcategory );

                //mainboxhtml = mainboxhtml + '<div class="card"><img src="' + obj[i].logo + '" alt="" /><h1><a href="' + obj[i].url + '">' + obj[i].merchantname + '</a></h1><p>' + obj[i].description + '</p><p class="tag_ad">' + obj[i].tagging_ads + '</p><p class="code">Промокод: ' + pr_code + '</p></div>';
                mainboxhtml = mainboxhtml + '<div class="card"><img src="/logos/' + obj[i].campaign.id + '.webp" alt="" /><h1><a href="' + obj[i].goto_link + '">' + obj[i].campaign.name + '</a></h1><p>' + stripHtml(obj[i].short_name) + '</p><p class="code"><a href="' + obj[i].goto_link + '">' + pr_code + '</a></p><p class="discount">' + discount + '</p></div>';

            }

        }
        //     else mi=1;
        // else
        // {
        //     console.log ( obj[i].short_name.toLowerCase() );
        //     console.log ( query );
        // }
    }


/*
    for ( i = 0; i< obj.length; i++ )
    {
        if ( obj[i].description != null && obj[i].description !='' )
            if ( obj[i].description.toLowerCase().includes(query) || obj[i].campaign.name.toLowerCase().includes(query) || obj[i].campaign.site_url.toLowerCase().includes(query) ||  obj[i].name.toLowerCase().includes(query) || obj[i].short_name.toLowerCase().includes(query) )
            {
                console.log (i);
                //console.log (obj[i].description);
                //console.log ( obj[i].regions )
                //console.log ( obj[i].frameset_link )
                console.log ( 'https://paywithcode.com/gotoshop.php?sale=' + obj[i].goto_link )

                mainboxhtml = mainboxhtml + '<div class="card"><img src="/logos/' + obj[i].campaign.id + '.webp" alt="" /><h1>' + obj[i].campaign.name + '</h1><p>' + obj[i].short_name + '</p></div>';
            }
        //     else mi=1;
        // else
        // {
        //     console.log ( obj[i].short_name.toLowerCase() );
        //     console.log ( query );
        // }
    }
    */





    showed_merchants = showed_merchants.filter(onlyUnique);
    showed_categories = showed_categories.filter(onlyUnique);
    showed_categories.sort();
    showed_merchants.sort();


    merchantshtml = '';
    for ( j = 0 ; j < showed_merchants.length; j++)
    {
        //console.log (showed_merchants[j]);
        merchantshtml = merchantshtml + '<option value="' + showed_merchants[j] + '">' + showed_merchants[j] + '</option>';
    }

    categorieshtml = '';
    for ( k = 0 ; k < showed_categories.length; k++)
    {
        //console.log (showed_categories[k]);

        categorieshtml = categorieshtml + '<option value="' + showed_merchants[j] + '">' + showed_categories[k] + '</option>';
    }
    categorieshtml = '<option value="all">All categories</option>' + categorieshtml ;
    merchantshtml = '<option value="all">All merchants</option>' + merchantshtml ;


    document.getElementById('mainbox').innerHTML = mainboxhtml;
    document.getElementById('categories').innerHTML = categorieshtml;
    document.getElementById('merchants').innerHTML = merchantshtml;

    if ( categorieshtml != '<option value="all">All categories</option>')
        document.querySelector(".additional_categories").style.display = '';
    else
        document.querySelector(".additional_categories").style.display = 'none';

    if ( merchantshtml != '<option value="all">All merchants</option>')
        document.querySelector(".additional_merchants").style.display = ''
        else
            document.querySelector(".additional_merchants").style.display = 'none';

    document.getElementById("categories").selectedIndex = chosen_category;
    document.getElementById("merchants").selectedIndex = chosen_merchant;


}
