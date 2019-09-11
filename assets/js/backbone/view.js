var CategoryView = Backbone.View.extend({
  initialize: function (data) {

    this.conditionalLvl = data.conditional;
    this.finalLvl       = data.finalLvl;
    this.email          = data.email;
    this.lastname       = data.lastname;
    this.phone          = data.phone;
    this.actualId       = data.actualId;
    this.namelvl        = data.namelvl;
    this.nQuestion      = data.nQuestion;
    this.model = new CategoryModel({
      id: data.id,
    });
    this.model.fetch({
      traditional: true,
    });
    this.model.on("change", this.render, this);
    }
  ,
  // FUNCTION TO SEND TEST TO EMAIL VIA AJAX

  sendTestEmail : function(email,lastname,phone,actualId, finalLvl, namelvl) {
    var test      = jQuery(levelForm).serializeArray();

    new TestView({
      email:       email,
      lastname:    lastname,
      phone:       phone,
      test :       test,
      idcat:       actualId,
      finalLvl:    finalLvl,
      namelvl:     namelvl
    });
  },
  splitIntoSubArray: function (arr, count) {
    var newArray = [];
    while (arr.length > 0) {
      newArray.push(arr.splice(0, count));
    }
    return newArray;
  },
  render: function () {

    var email       = this.email;
    var lastname    = this.lastname;
    var phone       = this.phone;
    var actualId    = this.actualId;
    var result      = this.model.get('result');
    var sendTest    = this.sendTestEmail;
    var half        = result.length / 5;
    var fases       = this.splitIntoSubArray(result, 5);
    var conditional = this.conditionalLvl;
    var finalLvl    = this.finalLvl;
    var namelvl     = this.namelvl;
    var qn          = this.nQuestion;

    fases.forEach(function (element, index) {

      indexFieldset = (index + 1);

      jQuery(levelForm).append('<fieldset data-step="' + (indexFieldset) + '" hidden><div></div></fieldset>');

      var elLen = element.length;
      var dataStep = jQuery('[data-step=' + (indexFieldset) + ']');

      for (var i = 0; i < elLen; i++) {

        var title = element[i].title;
        var id = element[i].id;
        var answerOne = element[i].meta.answers[0].text;
        var answetOneSlug = element[i].meta.answers[0].slug;
        var answerTwo = element[i].meta.answers[1].text;
        var answetTwoSlug = element[i].meta.answers[1].slug;
        var answerThree = element[i].meta.answers[2].text;
        var answetThreeSlug = element[i].meta.answers[2].slug;
        var iPlus = i + 1;
        jQuery(dataStep).children().append(`
              <div data-question="${iPlus}">
                <div>
                  <span>${qn}.</span>
                  <span>${title}</span>
                </div>
                <div>
                  <div>
                    <label for="data-step-${indexFieldset}-question-${iPlus}-option-0">
                      <input type="radio" name="${id}" id="data-step-${indexFieldset}-question-${iPlus}-option-0" value="${answetOneSlug}">
                        ${answerOne}
                    </label>
                  </div>
                  <div>
                    <label for="data-step-${indexFieldset}-question-${iPlus}-option-1">
                      <input type="radio" name="${id}" id="data-step-${indexFieldset}-question-${iPlus}-option-1" value="${answetTwoSlug}">
                        ${answerTwo}
                    </label>
                  </div>
                  <div>
                    <label for="data-step-${indexFieldset}-question-${iPlus}-option-2">
                      <input type="radio" name="${id}" id="data-step-${indexFieldset}-question-${iPlus}-option-2" value="${answetThreeSlug}">
                        ${answerThree}
                    </label>
                  </div>
                </div>
              </div>
          `);
          qn += 1;
      }
      if (conditional === true) {
        jQuery(levelForm).children().first().show();
      } else {
        jQuery('[data-step="1"]').show();
      }
    });
    
    this.nQuestion = qn;

    jQuery('input:radio').on('click', function(event){

      var check = true;
      jQuery("input:radio").each(function(){
          var name = jQuery(this).attr("name");
          if(jQuery("input:radio[name="+name+"]:checked").length == 0){
              check = false;
          }
      });

      if (check) {

        if(jQuery('.modal-block').children().children().css('display') == 'none') {
          jQuery('.modal-block').children().children().show();
        }
        // Here Im sending the email, passing the following args defined at the beginning of render()
        sendTest(email,lastname,phone,actualId, finalLvl, namelvl);
      }
    });
  },
  setNewLvl : function(data){

    this.conditionalLvl = data.conditional;
    this.finalLvl       = data.finalLvl;
    this.actualId       = data.actualId;
    
    this.model = new CategoryModel({
      id: data.id,
    });
    this.model.fetch({
      traditional: true,
    });

    this.model.on("change", this.render, this);

  }
});

var TestView = Backbone.View.extend({

  b : '#send-questions',
  initialize : function(data){
    this.finalLvl = data.finalLvl;
    this.model = new TestModel();
    this.blockEl();
    this.model.set("id_category",data.idcat);
    this.model.set("email",data.email);
    this.model.set("lastname",data.lastname);
    this.model.set("phone",data.phone);
    this.model.set("test",data.test);
    this.model.set("name-level",data.namelvl);
    this.model.save()
    this.model.on("change", this.render, this);
  },
  render : function(){
    var finalLvl = this.finalLvl;
    jQuery('.modal-block').children().children().not(':last-child').hide();
    if (!finalLvl) {
      jQuery('.test-last-step').show();
    } else {
      jQuery('.test-last-step').hide();
      jQuery('.wizard-container').hide();
      jQuery('.result-container').show();
      jQuery('.result-container').children().removeClass('d-none');
      jQuery('.result-container').children().removeClass('d-flex');
      jQuery('.result-container').addClass('result-container--show');
    }
  },
  blockEl:function(){
    jQuery('.modal-block').removeClass('d-none');
    jQuery('.test-last-step').hide();
  },


});

/*
  Example use for class LvlView:

  new LvlView();

*/
var LvlView = Backbone.View.extend({
  initialize : function(){
    this.model = new LvlsModel();
    this.model.fetch({
      traditional: true,
    });
    this.model.on("change", this.setLevels, this);
  },
  setLevels : function () {
    this.levels = this.model.get('levels');
    // new CategoryView({id:this.levels[0].idcat});
  },
  getLevels : function(){
    return this.levels;
  }
})
