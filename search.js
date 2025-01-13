async function getcoupons ()
{
    jQuery.get('data/admitad_coupons_string', function(data) {
        xmlstr = data;
    });
}

//xmlstr =  getcoupons ()

function search_coupons()
{

    // search
    obj = JSON.parse(xmlstr);

    query = document.getElementsByClassName('input-box')[0].children[0].value.toLowerCase();

    // clear screen


    document.getElementById('mainbox').innerHtml='';


    // add info searched
    mainboxhtml = '';
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



    document.getElementById('mainbox').innerHTML = mainboxhtml;
}
