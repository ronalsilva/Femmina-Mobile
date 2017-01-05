var OMComponentsMobile = function(){
    
    var that = this;
    console.log('iniciou');

    /*
    ================================================
    =================== LIGHTBOX ===================
    ================================================
    */

    this.lightbox = {}

    this.lightbox.open = function($el){
        $el.addClass('lightboxActive')
        $('body').addClass('lightboxActive');
        $("body.lightboxActive").css({'height': $el.height(), 'overflow':'hidden'})
    }

    this.lightbox.close = function($el){

        if (!$el.length){
            $el = $(".lightbox")
        }


        $('body.lightboxActive').css({'height':'100%','overflow':'initial'})
        $('body').removeClass('lightboxActive'); 
        $el.removeClass('lightboxActive')   
    }

    this.lightbox.actionOpen = function(){

        event.preventDefault()
        var el = $("#"+$(this).attr('data-target'))

        console.log(typeof $el != 'undefined')

        var position = $(this).attr('data-position')

        if(position == "full"){
            that.lightbox.position(el, "full")          
        }else{
            that.lightbox.position(el,"center") 
        }

        that.lightbox.open(el)
    }

    this.lightbox.actionClose = function (){
        event.preventDefault() 
        that.lightbox.close($("#"+$(this).attr('data-target')))
        
    }

    this.lightbox.position = function($el, position){

        console.log(position)
        $el.addClass(position)
        
        if(position == "center" || position == "" ){
            var el = $el.find('.lightboxContent')
            var pageHeight = $(window).height();
            var pageWidth = $(window).width();
            var contentWidth = el.outerWidth();
            var contentHeight = el.outerHeight();

            el.css("top", Math.max(0, ((pageHeight - contentHeight) / 2)) + "px");
            el.css("left", Math.max(0, ((pageWidth - contentWidth) / 2) + $(window).scrollLeft()) + "px");


        }
    }

    /*
    ================================================
    =================== ACCORDION ===================
    ================================================
    */

    this.accordion = {}

    this.accordion.open = function(content) {
        content.toggleClass('active');
        content.parent('.accordionList__item').toggleClass('open');
    }

    this.accordion.close = function(content) {
        content.toggleClass('active');
        content.parent('.accordionList__item').toggleClass('open');
    }

    this.accordion.closeOthers = function(content) {
        console.log('fecha todos');
        $(".accordionList__content").removeClass('active');
    }

    this.accordion.isOpen = function(content){
        
        console.log(content);
        if(content.hasClass('active')){
            return true;
        } else {
            return false;
        }
        
    }

    this.accordion.isToogle = function(parent, content){
        console.log(content.data('toggle'));

        if(parent.attr('data-toggle')){
            that.accordion.closeOthers(content);
        } 
    }

    this.accordion.actionOpen = function(){
        var accordionContent = $(this).next('.accordionList__content');
        var accordionParent = $(this).parents('.accordionList');

        //console.log('entrou');
        
        if(that.accordion.isOpen(accordionContent)){
            that.accordion.close(accordionContent);
        } else{
            that.accordion.isToogle(accordionParent, accordionContent);
            that.accordion.open(accordionContent);
        }
    }

    this.accordion.actionClose = function(){
        that.accordion.close();
    }

    /*
    ================================================
    ====================== TAB =====================
    ================================================
    */

    this.tab = {}

    this.tab.actionApply = function(){

        $(".tab .tabAction").removeClass('active');
        $(".tab .tabContentItem").removeClass('active');
        $(this).addClass('active')

        var target = $(this).attr('data-target');
        $("#"+target).addClass('active')
    }


    /*
    ================================================
    ==================== HEADER ====================
    ================================================
    */

    this.header = {}

    this.header.searchToggleBottom = {}


    this.header.searchToggleBottom.open = function($el){
        $el.addClass("active")
    }
    this.header.searchToggleBottom.close = function($el){
        $el.removeClass("active")
    }

    this.header.searchToggleBottom.actionOpen = function(){

        var el = $("#"+$(this).attr('data-target'))
        
        if($(this).hasClass('active')){
            $(this).removeClass('active')
            that.header.searchToggleBottom.close(el)
            
        }else{
            $(this).addClass('active')
            that.header.searchToggleBottom.open(el)
        }
    }
    this.header.searchToggleBottom.actionClose = function(){
        var el = $(".searchBox")
        that.header.searchToggleBottom.close(el)
    }


    /*
    ================================================
    ==================== SLIDER ====================
    ================================================
    */

    this.slider = {}
    this.slider.singleSlider = function (dots, arrows) {
        $(".mainGallery").slick({
            dots: dots,
            arrows: arrows,
            pauseOnHover: false,
            autoplay: true,
            autoplaySpeed: 4000
        });
    }
    this.slider.shelfSlider = function (dots, arrows, slidesToShow, slidesToScroll, vertical) {
        $(".shelfCarousel ul").each(function() {
            $(this).slick({
                dots: dots,
                arrows: arrows,
                infinite: true,
                slidesToShow: slidesToShow,
                slidesToScroll: slidesToScroll,
                speed: 500,
                vertical: vertical
            });
        });
    }

    this.slider.multipleSlider = function (dots, arrows, slidesToShow, slidesToScroll, vertical, centerMode) {
        $(".carouselGallery").slick({
            dots: dots,
            arrows: arrows,
            infinite: true,
            slidesToShow: slidesToShow,
            slidesToScroll: slidesToScroll,
            speed: 500,
            vertical: vertical,
            centerMode: centerMode,
        });
    }


    /*
    ================================================
    ==================== FILTER ====================
    ================================================
    */



    this.filter = {}
    this.filter.validateSearch = function(){
        
        $(".bt-refinar").wrap($('<div>',{'class':'filterRefine'}))
        $('.search-multiple-navigator input').on('change',OMComponents.filter.validateSearch.validate)
        $(".filterRefine").prepend($('<p>',{'class':'msgError','text':''}))
       
    }

    this.filter.validateSearch.validate   = function(){

        $(".bt-refinar").unbind('click')

        //funcao de retorno em caso de sucesso
        var successRequest = function(data){
            console.log(data)
            data.length > 0 ? that.filter.validateSearch.enable(parameters) : that.filter.validateSearch.disable()
        };

        //captura os parametros selecionados
        var parameters = "";
        $('.search-multiple-navigator input:checked').each(function(){parameters +="&" + $(this).attr('rel')})

        //faz uma requisicao para verificar a quantidade no resultado
        var option = {type: 'GET'}
        var parameters = "fq=C:/" + vtxctx.departmentyId+ "/" + vtxctx.categoryId + "/" + parameters;
        var request = $.ajax("/api/catalog_system/pub/products/search/?" + parameters,option)
        console.log(parameters)
        request.success(successRequest)
        request.error(function(e){console.error(e)})

    }

    //habilita a busca
    this.filter.validateSearch.enable   = function(parameters){
        $(".filterRefine .msgError").text("")
        $(".bt-refinar").addClass('enabled')
        $(".bt-refinar" ).on('click', function(){
            window.location.href = "/busca?" + parameters
        });
    }

    //desabilita a busca
    this.filter.validateSearch.disable = function(){
        $(".bt-refinar").removeClass('enabled')
        $(".filterRefine .msgError").text("Nenhum produto encontrado com os filtros selecionados")
        
    }


    /*
   ================================================
   ====================== MENU ====================
   ================================================
   */

   this.menu = {}


   this.menu.appendBackButton = function(content){
       //var textMenu = content.text();
       //content.append('<li class="closeMenu">'+textMenu+'</li>');
       $(".menu-departamento .closeMenu").on("click", that.menu.actionClose);
   }

   this.menu.open = function(content) {
       content.addClass('active');
       that.menu.appendBackButton(content);
       console.log(content);
   }

   this.menu.close = function(content) {
       $('.menu-departamento ul').removeClass('active');
       $('.menu-departamento').removeClass('active');
       //$('.closeMenu').remove();
   }

   this.menu.actionOpen = function(){
        var target = $(this).attr('data-target')
        $(target + " .menu-departamento").addClass('active')
        var menuList = $(this).next('ul');
        that.menu.open(menuList);
   }

   this.menu.actionClose = function(){
       that.menu.close();

   }

   this.menu.targetLink = function(){

   }

   this.menu.loop = function(element, toDo){
       element.each(function(){
           toDo
       });
   }

   this.menu.init = function(menu){
        var link = $(menu).find('h3 a');
        $(menu+' .menu-departamento h3').attr('data-target', menu)
        var submenu = $(menu+' h3').next('ul');
        
        $(menu).addClass('js-Menu');

        //that.menu.loop(link, console.log(link, submenu));


        $(menu+' .menu-departamento ul').each(function(){


           var submenu = $(this).next('ul')[0];
           if($('li', this)[0]){
               var linkUrl = $(this).prev('h3').find('a').attr('href');
               var linkElement = '<li><a href="'+linkUrl+'">Ver todos</a></li>';
               var textMenu = $(this).prev('h3').text();
               $(this).prev('h3').addClass('noTarget');
               $(this).append(linkElement);
               $(this).prepend('<li class="closeMenu">'+textMenu+'</li>');
               console.log(linkUrl);
           }
           
        });

        $(menu+" .menu-departamento h3.noTarget").on("click", that.menu.actionOpen);

       $('.noTarget a').on('click', function(event){
           event.preventDefault();
       });
   }


   /*
   ================================================
   ============== MENU - CATEGORIES ===============
   ================================================
   */


   this.menuCategory = {}

   this.menuCategory.toggleMenu = function($el, $elAction){
        $el.toggleClass('active');
        $elAction.toggleClass('open');
   }

   this.menuCategory.actionToggle = function(){
        that.menuCategory.toggleMenu($('.menuDept'),$('.titulo-sessao .icon-arrow'));
   }

   

   this.menuCategory.init = function(){
        var categories = $('.menuDept .menu-departamento h4');
        if(categories[0]){
            $('.titulo-sessao').append('<span class="icon-arrow"></span>');
            $('.menuDept').addClass('js-menuCategory');
        }

        $('.titulo-sessao').on('click', that.menuCategory.actionToggle);
        //$('.titulo-sessao .open').on('click', that.menuCategory.actionClose);
   }



    /*
    ================================================
    ==================== SHARE ====================
    ================================================
    */

    this.share = {}

    this.share.getContent = function(){

        var attribute = {}
        attribute['pageUrl'] = window.location.href;
        attribute['pageMedia'] = $('.mainProductImage img').attr('src');

       return attribute;


    }

    this.share.getSocialType = function(el){
        var socialMedia = el.attr('data-social');
        return socialMedia
    }

    this.share.create = function(el, message) {
        
        //console.log(message);

        el.each(function(){
            //console.log(that.share.getContent().pageUrl,that.share.getSocialType($(this)));

            var pageUrl = that.share.getContent().pageUrl
            var pageMedia = that.share.getContent().pageMedia
            switch(that.share.getSocialType($(this))) {
                case 'facebook':
                    var href = "http://www.facebook.com/sharer.php?u=" + pageUrl;
                    break;
                case 'twitter':
                    var href = "http://twitter.com/home?status="+message+" "+ pageUrl;
                    break;
                case 'whatsapp':
                    var href = "whatsapp://send?text=" + pageUrl;
                    break;
                case 'google':
                    var href = "https://plus.google.com/share?url=" + pageUrl;
                    break;
                case 'pinterest':
                    var href = "https://pinterest.com/pin/create/button/?url="+pageUrl+"&media="+pageMedia+"&description=Olha%20o%20que%20eu%20achei";
                    break;
                case 'email':
                    var href = "mailto:?subject="+message+"&amp;body=" + pageUrl;
                    break;
                default:
                    
            }

            $(this).attr({"href":href, "target":"_blank"});
        });
    }


    /*
    ================================================
    ==================== STORES ====================
    ================================================
    */

    this.stores = {}



    this.stores.init = function(){
        console.log('iniciou');
        GoogleMaps.init();



    }

    /*
    ================================================
    ==================== SCROLL TO =================
    ================================================
    */

    this.scrollTo = {}

    this.scrollTo.goTo = function(target, time, animate){
        $("html, body").stop().animate({scrollTop:target.offset().top}, time, animate);
    }

    this.scrollTo.header = function(animate){
        
        var body = $("html, body");

        that.scrollTo.goTo(body, '500', 'swing');

        

    } 

    /*
    ================================================
    =================== CATALOG ====================
    ================================================
    */


    this.catalog = {}
    this.catalog.selectView = {}
  
        
    this.catalog.selectView.toggle = function(layout){
        $('.resultItemsWrapper').removeClass("list")
        $('.resultItemsWrapper').removeClass("table")
        $('.resultItemsWrapper').addClass(layout)
    }

    this.catalog.selectView.actionSelect = function(){
        $('.selectViewAction').removeClass('active')
        $(this).addClass('active')
        that.catalog.selectView.toggle($(this).attr('data-layout'))
    }



    /*
    ================================================
    =================== PRODUCT ====================
    ================================================
    */

    this.product = {}
    this.product.selectorSkuLightBox = {}
    this.product.selectorSkuLightBox.convert = function(){


        $(".sku-selector-container > ul ").each(function(){
            
            var textSpecification   = $(this).find('.specification').text() //DESCRICAO DA VARIACAO DO SKU
            
            function setSelectedSku (){
                var val = $('.sku-selector-container #skuSelector'+ textSpecification + ' input:checked').val()
                var cloneClass = $('.sku-selector-container #skuSelector'+ textSpecification + ' input:checked + label').attr('class')
                $('#btnSkuSelector'+ textSpecification + " .selected").text(val).addClass(cloneClass)
            } 
             
            var idLightbox = '#skuSelector'+textSpecification; //ID PARA O LIGHTBOX

            //CRIA O LIGHTBOX
            var lightbox = $('<div>',{'id':'skuSelector'+textSpecification,'class':'lightbox'})      
            lightbox.append($('<div>',{'class':'lightboxContent'}).append($('<div>',{'class':'lightboxContentInner'})))
            lightbox.append($('<div>',{'class':'lightboxOverlay'}))
            lightbox.appendTo('.sku-selector-container');

            $(this).appendTo(idLightbox + " .lightboxContentInner") // TRASFERE O CONTEUDO HTML DA VARIACAO PARA O LIGHTBOX
            $('.sku-selector-container').prepend($('<a>', {'id':'btnSkuSelector'+textSpecification,'data-target':'skuSelector'+textSpecification,'class':'skuSelectorAction','text':textSpecification}).append($('<span>',{'class':'selected'})))
            $(idLightbox + " .lightboxContentInner").append($('<a>', {'data-target':'lightboxTrigger','class':'btnSelect lightboxTriggerClose','text':"OK"}))
            $(idLightbox + " .lightboxContentInner").prepend($('<h2>', {'class':'lightbox__title mainTitle','text':"Escolha o " + textSpecification}))
            $(idLightbox + " .lightboxContent").prepend($('<div>',{'class':'lightboxAction'}).append($('<span>',{'class':'lightboxTriggerClose ico'}).append($('<i>',{'class':'icon-close'}))) )
            //===============

            if($('.sku-selector-container #skuSelector'+ textSpecification + ' input').length == 1){
                setSelectedSku()
            }

            $('.sku-selector-container #skuSelector'+ textSpecification + ' input').on('click',function(){
                setSelectedSku()
            })


        })

        $(".sku-selector-container .skuSelectorAction").on("click", that.lightbox.actionOpen);
        $(".sku-selector-container .lightboxTriggerClose").on("click", that.lightbox.actionClose);
        $(".sku-selector-container .lightboxOverlay").on("click", that.lightbox.actionClose);
    }

    this.product.thumbnail = {}
    this.product.thumbnail.carouselApply = function(){
        
        $(".thumbs").hide();    
        if ($(".thumbs").hasClass('slick-initialized')) {
            $(".thumbs").slick('unslick');
        }

        $('.thumbs li a').each(function() {
            var urlgrande = $(this).attr('rel');
            $(this).find('img').attr('src', urlgrande);
        });

        $(".thumbs").slick({
            dots: true,
            arrows: false,
        });  

        $(".thumbs").show();

    }
    
    this.product.thumbnail.actionApply = function(){
        
        $(".thumbs").hide();  
        setTimeout(function(){ 
           that.product.thumbnail.carouselApply()
        });

        
    }
        /*
    ================================================
    =================== SHOW MORE ====================
    ================================================
    */

    this.showMore = {}

    this.showMore.init = function(options){
        //var height = 100;
        
        var settings = $.extend({
            element     : '.productDetailsContent',
            _parent      : '.productDetails',
            _height      : 100
        }, options);
        
        var content = $(settings.element).height();

        //console.log(settings._height);

        if(content > settings._height){
            $('.showMore').show();
            $(settings._parent).append('<span class="showMore"></span>');
            $(settings.element).css({'height':settings._height});
            console.log('A altura do '+settings.element+' é maior que '+content);
        } else {
            console.log('A altura do '+settings.element+' é menor que '+settings._height);
        }

        $('.showMore').on('click', function(){

            if($(this).hasClass('active')){
                $(settings.element).css({'height':settings._height});
                $(this).removeClass('active');
            }else {
                $(settings.element).css({'height':content});
                $(this).addClass('active');
            }
            
        });
    }



    /*
    ================================================
    =================== ZOOM ====================
    ================================================
    */


    this.product.zoom = {}
    this.product.zoom.init = function(options){

        var settings = $.extend({
            _name            : 'zoomImage',
            _itemAction      : '.thumbs li a',
            _position        : 'full',
            _height          : 100
        }, options);

        $('.all').append('<div class="lightbox" id="'+settings._name+'"><div class="lightboxOverlay"></div><div class="lightboxContent"><div class="lightboxAction"><span class="lightboxTriggerClose ico" data-target="'+settings._name+'"><i class="icon-close"></i>fechar</span></div><div class="lightboxContentInner"></div></div></div>');
        $(settings._itemAction).each(function(){
            $(this).attr('data-target', settings._name);
            $(this).attr('data-position', settings._position);
            //$(this).addClass('lightboxTrigger');
        });

        $("#"+settings._name+" .lightboxTriggerClose").on("click", that.lightbox.actionClose);
        $("#"+settings._name+" .lightboxOverlay").on("click", that.lightbox.actionClose);
        $(settings._itemAction).on("click", that.product.zoom.getImage);
        $('.imageZoom').on("click", that.product.triggerLink);
        $(settings._itemAction).on("click", that.lightbox.actionOpen);
        $('.imageZoom').on("click", that.lightbox.actionOpen);
    }

    this.product.triggerLink = function(){
        $(".ON").trigger( "click" );
    }

    this.product.zoom.open = function(){

    }

    this.product.zoom.getImage = function(){
        var urlzoom = $(this).attr('rel');
        console.log($(this));
        $("#zoomImage .lightboxContentInner").html("<img src='" + urlzoom + "'/>");

       
    }




    /*
    ================================================
    ==================== account ===================
    ================================================
    */

    this.account = {}
    this.account.showLinkMenu = function(){

        vtexjs.checkout.getOrderForm().done(function(data){
            if (data.loggedIn){
                console.log(data)
                $('.accountLink').show().addClass('active')
            }  
        })
        $(document).ajaxStop(function(){
                
        })
    }

    /*
    ================================================
    ==================== INIT =====================
    ================================================
    */

    this.init = function(){
        
        //lightboxTrigger
        $(".lightboxTrigger").on("click", that.lightbox.actionOpen);
        $(".lightboxTriggerClose").on("click", that.lightbox.actionClose);
        $(".lightboxOverlay").on('click',that.lightbox.actionClose);

        //accordion
        $(".accordionList__title").on("click", that.accordion.actionOpen);

        //menu
        //$(".menu-departamento h3").on("click", that.menu.actionOpen);

        //tab
        $('.tabAction').on('click',that.tab.actionApply)

        //searchToggleBottom
        $('.searchToggleBottomTrigger').on('click',that.header.searchToggleBottom.actionOpen)
        $('.searchBoxOverlay').on('click',that.header.searchToggleBottom.actionClose)

        //selectView catalogo
        $('.selectViewAction').on('click',that.catalog.selectView.actionSelect)

    }
  
}

