
//CRIA UMA INSTANCIA DO OMComponentsMobile
var OMComponents = new OMComponentsMobile();

var flag = {
    shelfColors: function () {
        $.getScript("//io.vtex.com.br/vtex.js/1.0.0/catalog.min.js")
        .done(function( script, textStatus ) {
        	console.log('erro ao buscar cores')
            $(".productList li").each(function() {
                var _this = $(this);
                var originalImg = $(this).find(".productImage img").attr("src");
                $(this).find(".productImage a").attr("data-imagepric", originalImg);
                if($(this).find(".idProd").length) {
                    var idProd = $(this).find(".idProd").attr("data-id");
                    idProd = parseInt(idProd);

                    vtexjs.catalog.getProductWithVariations(idProd).done(function(product){
                    
                        if(product.dimensionsMap.Cor) {

                            if (product.dimensionsMap.Cor.length>0) {
                                
                                var html = '<ul class="sku-colors">';
                                $.each(product.dimensionsMap.Cor, function(i) {
                                    var cor = product.dimensionsMap.Cor;

                                    $.each(product.skus, function(w) {
                                        var oldClass = product.skus[w].dimensions.Cor;
                                        var newClass = oldClass.replace(/\s/g, "-");
                                        var newClass = newClass.replace(/\//g, "-");
                                        var newClassCase = newClass.toLowerCase();

                                        if (product.skus[w].dimensions.Cor == cor[i] && product.skus[w].available == false){
                                            html += '<li class="item-dimension-Cor sr_'+newClass+'" data-image="'+product.skus[w].image+'"><img src="'+product.skus[w].image+'" width="55" heigth="55" alt="'+product.skus[w].skuname+'"/><label class="itemCor sr_'+newClassCase+' skuespec_Cor_opcao_'+newClass+'"><span class="tooltip"><span class="tooltip-inner">'+product.skus[w].dimensions.Cor+'</span></span></label></li>';
                                            return false;
                                        } else if (product.skus[w].dimensions.Cor == cor[i] && product.skus[w].available == true) {
                                            html += '<li class="item-dimension-Cor unavailable sr_'+newClass+'" data-image="'+product.skus[w].image+'"><img src="'+product.skus[w].image+'" width="55" heigth="55" alt="'+product.skus[w].skuname+'"/><label class="itemCor sr_'+newClassCase+' skuespec_Cor_opcao_'+newClass+'"><span class="tooltip"><span class="tooltip-inner">'+product.skus[w].dimensions.Cor+'</span></span></label></li>';
                                            return false;
                                        };
                                    });
                                });

                                html += '</ul>';
                                _this.find(".shelf-colors").html(html);
                                _this.find('.shelf-colors ul').slick({
                                    dots: false,
                                    arrows: true,
                                    slidesToShow: 3,
                                    slidesToScroll: 1,
                                    pauseOnHover: false,
                                    autoplay: false,
                                    infinite: false,
                                    autoplaySpeed: 4000
                                });

                            } else {
                                console.log('erro ao buscar cores')
                            }
                        }
                    });
                    console.log('teste');
                } else {
                	console.log('testee')
                }

                
            });
        });

        $(".productList li").on("mouseenter", ".shelf-colors li", function(){
            var img = $(this).attr("data-image");
            $(this).closest(".shelf-colors").closest("li").find(".productImage img").attr("src",img);
        });
        $(".productList li").on("mouseleave", ".shelf-colors li", function(){
            var img = $(this).closest(".shelf-colors").closest("li").find(".productImage a").attr("data-imagepric");
            $(this).closest(".shelf-colors").closest("li").find(".productImage img").attr("src",img);
        });
    }
}

$(document).ready(function(){

	
	//GLOBAL ===============================================
	//=======================================================

	flag.shelfColors();

    var feed = new Instafeed({
      get: 'user',
      userId: 3674652645,
      accessToken: '3674652645.41ac242.c4cb227b3e574632be108f10647d1fbe',
      link: 'true',
      limit: '2',
      resolution: 'low_resolution',
      target: 'instafeed',
      template: '<div class="col-xs-4-inst"><a target="_blank" href="{{link}}"><img src="{{image}}" class="img-responsive img-thumbnail"/><div class="overlayinst"><span class="likesinst">{{likes}}</span><p>{{caption}}</p></div></a></div>',
      after: function() {
        $('#insta-photos').slick({
          infinite: true,
          slidesToShow: 5,
          slidesToScroll: 1
        });
      }
    });
    feed.run(); 


	//INICIA OS COMPONENTES DA LIB
	OMComponents.init();

	//APLICAS AS FUNCIONALIDADES DO MENU
	OMComponents.menu.init('#pageMenu');

	OMComponents.slider.singleSlider(true,false);
	OMComponents.slider.shelfSlider(true, true, 2, 2, false);

	OMComponents.account.showLinkMenu();

	$('.diferentials').slick({
		infinite: true,
		arrows: false,
		slidesToShow: 1,
		slidesToScroll: 1
	});

	//REMOVE O HELPER COMPLEMENT DAS VITRINES
	$(".helperComplement").remove();


	//APLICA FUNCIONALIDADE DE VOLTAR AO TOPO
	$('.backTop').on('click', OMComponents.scrollTo.header);	

	//Lista de desejo =======================================
	//=======================================================

    if($("body").hasClass("manage")){
    	$('.giftlist-table .giftlist-body-name').on('click', function(event) {
    		event.preventDefault();
    		$(this).toggleClass('active');
    		$(this).parent().find('.giftlist-body-action').slideToggle().toggleClass('active');
    	});
    }

	//PRODUTO ===============================================
	//=======================================================

    if($("body").hasClass("product")){
		
		//CHAMA O ZOOM
		OMComponents.product.zoom.init();

    	//TRANSFORMA A SELECAO DE SKU EM LIGHTBOX
		OMComponents.product.selectorSkuLightBox.convert()

    	//GERA OPCAO DE COMPARTILHAR NAS REDES SOCIAIS
		OMComponents.share.create($('.shareProduct a'), 'Confira nosso produto');
		
		//APLICA O CARROUSEL NA SELCAO DE FOTOS DO PRODUTO
		OMComponents.product.thumbnail.carouselApply()
		$(window).on("skuDimensionChanged.vtex", OMComponents.product.thumbnail.actionApply)

		OMComponents.showMore.init({_height: 150});

		$('.productDetails h3').on('click', function(event) {
			event.preventDefault();
			$(this).parent().toggleClass('active');
		});
	}


	//CATALOGO ==============================================
	//=======================================================

	$(".orderBy:eq(0)").prependTo(".filterOptions");


	//CATEGORIA E BUSCA	
	if($("body").hasClass("category") || $("body").hasClass("search-result")){

        $('.search-multiple-navigator .refino-marca').addClass('refino');
        $('.search-multiple-navigator .refino label').each(function(index, el) {
            $(this).append('<span class="checkBox" />');
        });

		//VALIDA O RESULTADO DO FILTRO AO SELECIONAR
		OMComponents.filter.validateSearch()
		
		//LIB EXTERNA QD_infinityScroll
		try {
        	$(".vitrine [id*=ResultItems]").QD_infinityScroll();		
		}catch(e){
			console.error(e)
		}



		$('.search-multiple-navigator fieldset h5').on('click', function(event) {
			event.preventDefault();
			$(this).parent().toggleClass('active');
		});

	}


	//DEPARTAMENTO
	if($("body").hasClass("departament")){
		OMComponents.slider.multipleSlider(true, false, 1, 1, false, true);
		OMComponents.menuCategory.init();	
	}


	//BUSCA
	if($('body').hasClass("search-result")) {
		$(".resultado-busca-numero:eq(0), .resultado-busca-termo:eq(0)").prependTo(".topName");

		$(".search-single-navigator").insertBefore(".search-multiple-navigator");
	}

	if(!$(".resultado-busca-termo .value").is(":empty")){
		$(".resultado-busca-termo").addClass("hasResult");
	}

	//BUSCA VAZIA
	var word = decodeURI(window.location.search);
	word = word.replace("?ft=","");
	$(".emptySearch .searchTitle .searchTerm").text('"' + word + '"');


	//LOJAS ===============================================
	//=======================================================
	if($('body').hasClass('stories')){
		//$('#mapAddress').geocomplete();
		OMComponents.stores.init();
	}

});


$(document).ajaxStop(function () {
	//REMOVE O HELPER COMPLEMENT DAS VITRINES
	$(".helperComplement").remove();
	$('.resultado-busca-termo.hasResult .label').text('Resultado da Busca')
});
