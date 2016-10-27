from django.shortcuts import render,get_list_or_404
from django.contrib import messages
from django.core.context_processors import csrf
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponse
from django.core.validators import RegexValidator
from django.template import RequestContext
from color.models import color


# Create your views here.
alphanumeric = RegexValidator(r'^(#|rgb|rgba)[0-9a-zA-Z,]+', 'Only alphanumeric characters and underscore are allowed.')

#--------------------------------color_form 记录颜色值------------------------------------------------------

def color_form(request):
    if request.method == 'GET':
        title = "color"
        all_color = color.objects.all()
        
        return render(request,'color/color.html', locals(),
                                  context_instance=RequestContext(request))
    
    elif request.method == 'POST':
        name = request.POST['name']
        
        try:
            alphanumeric(name)
        except:
            messages.add_message(request, messages.WARNING, u'颜色名只允许英文字母、数字及括号')
            return HttpResponseRedirect(reverse('color:color_form'))
        
        if color.objects.filter(name=name).exists():
            messages.add_message(request, messages.WARNING, u'这个颜色已存在')
            return HttpResponseRedirect(reverse('color:color_form'))
        
        colorName = color.objects.create(name=name)
        colorName.save()
        return HttpResponseRedirect(reverse('color:color_form'))
    
    
#-----------------------------------------search_color---------------------------------------------------------

def search_color(request):
    color_name = request.POST['color_name']
    if color_name:
        all_color = color.objects.filter(name__contains = color_name)
#        all_color = get_list_or_404(color,name__contains = color_name)
        if not all_color:        
            messages.add_message(request,messages.WARNING,u'你数据库里还没有这个颜色！')
            return HttpResponseRedirect(reverse('color:color_form'))
        else:
            return render(request,'color/color.html',locals(),context_instance=RequestContext(request))


    else:
        messages.add_message(request,messages.WARNING,u'请输入您要查询的颜色值！')
        return HttpResponseRedirect(reverse('color:color_form'))
    
    
#-------------------------------------------color_detail-------------------------------------------------------

def color_detail(request,color_id):
#    color_id = request.GET['color_id']
    color_detail = color.objects.get(pk = color_id)
    
    return render(request,'color/color.html',locals(),context_instance=RequestContext(request))

#---------------------------------- saveColorHint --------------------------------------------------

def saveColorHint(request):
    colorHintList = ""
    if request.method == 'GET':
        saveColorName = request.GET['colorName']
        colorHint = color.objects.filter(name__contains = saveColorName)
        for colorHint in colorHint:
            colorHintList = colorHintList + colorHint.name + "，"    #注意这里的colorHint.name
        return HttpResponse('%s'%colorHintList)
            