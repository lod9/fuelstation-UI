$(document).ready(function() {
    window.addEventListener('message', function(event) {
        if (event.data.action == true) {

            fuel = event.data.fuel;
            datafuel = event.data.fuel
            dataGas = event.data.data


            $('#FuelPrice').empty();
            $('#FuelPrice').append(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dataGas.price));
            $('#stock').empty();
            if (dataGas.stock == 0) {
                $('#stock').append("<b>OUT OF STOCK<BR>" + "NO PETROL</b>");
                $('.MainContainer').fadeOut();
            } else {
                $('#stock').append("<b>Fuel in stock:<BR>" + dataGas.stock + " Litres</b>");
                $('.MainContainer').fadeIn(300);
            }

            $('body').css('display', 'flex');
            $('.modal').css('display', 'none');
            $('.FuelAmount').text(Math.round(event.data.fuel) + ' %');
            $("#amount").val("")

            $(document).keyup(function(e) {
                if (!counting) {
                    if (e.key === "Escape") {
                        myStop();
                        $("#amount").val("")
                        counting;
                        inv;
                        price;
                        perc_new;
                        totalPercent;
                        ManuelPetrol;
                        completar;
                        maxFuel;
                        $.post('http://lod-fuel/escape', JSON.stringify({}));
                    }
                }
            });
        } else {
            $('body').fadeOut();
        }
    });

    function close() {}

    var counting;
    var completar;
    var ManuelPetrol;
    var price;
    var inv;
    var totalPercent;
    var perc_new;
    var maxFuel;


    function myStart() {
        if (inv == undefined) { inv = setInterval(increase, 1000); }
    }

    function myStop() {
        if (inv !== undefined) {
            clearInterval(inv);
            inv = undefined;
        }
    }

    function increase() {
        if (counting) {
            if (fuel < maxFuel) {
                fuel++;
                totalPercent = Math.round(fuel) + '%'
                $('.FuelAmount').text(totalPercent);
            } else {
                $.post('http://lod-fuel/removeanim', JSON.stringify({}));
                if (completar) {
                    console.log(perc_new * dataGas.price)
                    console.log(price)
                    $.post('http://lod-fuel/pay', JSON.stringify({ new_perc: perc_new * dataGas.price }));
                    perc_new;
                    completar = !completar;
                } else if (ManuelPetrol) {
                    console.log(perc_new * dataGas.price)
                    console.log(price)
                    $.post('http://lod-fuel/pay', JSON.stringify({ new_perc: price }));
                    price;
                    ManuelPetrol = !ManuelPetrol;
                }
                counting = !counting;
                inv;
                totalPercent;
                maxFuel;
                myStop();
                $.post('http://lod-fuel/escape', JSON.stringify({}));
            }
        }
    }

    $("#FullPetrol").click(function() {
        if (!counting) {
            perc_new = 100 - Math.round(datafuel);
            $.post('http://lod-fuel/checkpay', JSON.stringify({ new_perc: perc_new }));
            counting = !counting;
            completar = !completar;
            maxFuel = 99
            $('.modal span').text("Do you want to fill the tank at $" + (perc_new * dataGas.price).toFixed(2));
            $('.modal').fadeIn(300);
            $('.TopContainer').fadeOut();
            $('left').fadeOut();
            $('.MainContainer').fadeOut();
        }
    });

    $("#ManuelPetrol").click(function() {
        if (!counting) {
            price = Math.round($("#amount").val());
            if (price > dataGas.price) {
                console.log(price)
                console.log(((100 - Math.round(datafuel)) * dataGas.price))
                if (price <= ((100 - Math.round(datafuel)) * dataGas.price)) {
                    $.post('http://lod-fuel/checkpay', JSON.stringify({ new_perc: price }));
                    counting = !counting;
                    ManuelPetrol = !ManuelPetrol;
                    maxFuel = (Math.floor(price / dataGas.price) + Math.round(datafuel)) - 1
                    $('.modal span').text("Do you want to fill the tank at $ " + price);
                    $('.modal').fadeIn(300);
                    $('.TopContainer').fadeOut();
                    $('left').fadeOut();
                    $('.MainContainer').fadeOut();
                } else {
                    var texto = "The maximum value to fill the tank is <b>$" + ((100 - Math.round(datafuel)) * dataGas.price) + "</b>!"
                    $.post('http://lod-fuel/notifytext', JSON.stringify({ text: texto }));
                }
            } else {
                var texto = "The price must be greater than $" + dataGas.price + "!"
                $.post('http://lod-fuel/notifytext', JSON.stringify({ text: texto }));
            }
        }
    });

    $("#close").click(function() {
        $("#amount").val("")
        counting;
        inv;
        price;
        perc_new;
        totalPercent;
        ManuelPetrol;
        completar;
        maxFuel;
        $.post('http://lod-fuel/escape', JSON.stringify({}));
    })

    $("#plus").click(function() {
        if (!counting) {
            if (Math.round($("#amount").val()) < 100) {
                $("#amount").val(Math.round($("#amount").val()) + 1)
                price = $("#amount").val()
            }
        }
    });

    $("#minus").click(function() {
        if (!counting) {
            if (Math.round($("#amount").val()) > 0) {
                $("#amount").val(Math.round($("#amount").val()) - 1)
                price = $("#amount").val()
            }
        }
    });

    $(".accept").click(function() {
        if (counting) {
            $('.modal').fadeOut();
            $('.TopContainer').fadeIn(300);
            $('left').fadeIn(300);
            $('.MainContainer').fadeIn(300);
            $.post('http://lod-fuel/startanim', JSON.stringify({}));
            myStop();
            myStart();
        }
    })

    $(".recuse").click(function() {
        $('.modal').fadeOut();
        $('.TopContainer').fadeIn(300);
        $('left').fadeIn(300);
        $('.MainContainer').fadeIn(300);
        if (completar) {
            counting = !counting;
            completar = !completar;
        } else if (ManuelPetrol) {
            counting = !counting;
            ManuelPetrol = !ManuelPetrol;
        }
    })
});