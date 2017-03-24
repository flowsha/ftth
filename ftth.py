# -*- coding: utf-8 -*-

import web
from datetime import datetime
import time
import os, glob
import uuid, hashlib
import json
import xlrd, xlwt

web.config.debug = False
web.config.session_parameters['timeout'] = 1800 #30 * 60 seconds 30 minutes
web.config.session_parameters['ignore_expiry'] = False

urls = (
    '/ftth/(.*)', 'ftth'
)

app = web.application(urls, globals())
session = web.session.Session(app, web.session.DiskStore("sessions"))
        
class ftth:  
    
    def __init__(self):
        self.db = web.database("localhost:3306", dbn='mysql', user='root', pw='xtcdma', db='ftth')
    
    def getProjs(self):
        p = web.input()
            
        if session.USER_ID == "admin":
            where = "ID<>$ID"
            params = {"ID":""}
        else:
            where = "V_DEPT=$V_DEPT"
            params = {"V_DEPT":session.DEPT}
                
        if hasattr(p, "V_SERVICE_NUM") and p.V_SERVICE_NUM <> "":
            where += " and V_SERVICE_NUM=$V_SERVICE_NUM"
            params["V_SERVICE_NUM"] = p.V_SERVICE_NUM
        if hasattr(p, "V_PERSON") and p.V_PERSON <> "":
            where += " and V_PERSON=$V_PERSON"
            params["V_PERSON"] = p.V_PERSON
        if hasattr(p, "V_DEPT"):
            where += " and V_DEPT=$V_DEPT"
            params["V_DEPT"] = p.V_DEPT
        if hasattr(p, "V_ZONE") and p.V_ZONE <> "":
            where += " and V_ZONE=$V_ZONE"
            params["V_ZONE"] = p.V_ZONE
        if hasattr(p, "V_IDENTIFY"):
            where += " and V_IDENTIFY=$V_IDENTIFY"
            params["V_IDENTIFY"] = p.V_IDENTIFY
        if hasattr(p, "D_TIDAN_TIME_START") and hasattr(p, "D_TIDAN_TIME_END"):
            if p.D_TIDAN_TIME_START <> "" and p.D_TIDAN_TIME_END <> "":
                where += " and (D_TIDAN_TIME between $D_TIDAN_TIME_START and $D_TIDAN_TIME_END)"
                params["D_TIDAN_TIME_START"] = p.D_TIDAN_TIME_START
                params["D_TIDAN_TIME_END"] = p.D_TIDAN_TIME_END + "23:59:59"
            elif p.D_TIDAN_TIME_START <> "" and p.D_TIDAN_TIME_END == "":
                where += " and (D_TIDAN_TIME >= $D_TIDAN_TIME_START)"
                params["D_TIDAN_TIME_START"] = p.D_TIDAN_TIME_START
            elif p.D_TIDAN_TIME_START == "" and p.D_TIDAN_TIME_END <> "":
                where += " and (D_TIDAN_TIME <= $D_TIDAN_TIME_END)"
                params["D_TIDAN_TIME_END"] = p.D_TIDAN_TIME_END + "23:59:59"
        if hasattr(p, "D_SHOULI_TIME_START") and hasattr(p, "D_SHOULI_TIME_END"):
            if p.D_SHOULI_TIME_START <> "" and p.D_SHOULI_TIME_END <> "":
                where += " and (D_SHOULI_TIME between $D_SHOULI_TIME_START and $D_SHOULI_TIME_END)"
                params["D_SHOULI_TIME_START"] = p.D_SHOULI_TIME_START
                params["D_SHOULI_TIME_END"] = p.D_SHOULI_TIME_END + "23:59:59"
            elif p.D_SHOULI_TIME_START <> "" and p.D_SHOULI_TIME_END == "":
                where += " and (D_SHOULI_TIME >= $D_SHOULI_TIME_START)"
                params["D_SHOULI_TIME_START"] = p.D_SHOULI_TIME_START
            elif p.D_SHOULI_TIME_START == "" and p.D_SHOULI_TIME_END <> "":
                where += " and (D_SHOULI_TIME <= $D_SHOULI_TIME_END)"
                params["D_SHOULI_TIME_END"] = p.D_SHOULI_TIME_END + "23:59:59"
                
        results = self.db.select("tb_projects", where=where, vars=params, order="D_TIDAN_TIME DESC")
        
        if not hasattr(p, "page"): return results
        
        total = len(results)
        reStr = "{success:true,total:%s,data:[" % total
        if total > 0:
            results = self.db.select("tb_projects", where=where, vars=params, limit=p.limit, offset=p.start, order="D_TIDAN_TIME DESC")
            for r in results:
                reStr += "{ID_VIEW:'%s',V_SERVICE_NUM_VIEW:'%s',V_ZONE_VIEW:'%s',V_CUST_NAME_VIEW:'%s',V_PHONE_VIEW:'%s',V_ADDRESS_VIEW:'%s',V_IDENTIFY_VIEW:'%s',N_MONEY_VIEW:%s,V_PERSON_NO_VIEW:'%s',V_PERSON_VIEW:'%s',V_DEPT_VIEW:'%s',D_TIDAN_TIME_VIEW:'%s',V_TIDAN_REN_VIEW:'%s',V_REMARK_VIEW:'%s',V_FIBER_INFO_VIEW:'%s',D_SHOULI_TIME_VIEW:'%s'}," % (r.ID, r.V_SERVICE_NUM, r.V_ZONE, r.V_CUST_NAME, r.V_PHONE, r.V_ADDRESS, r.V_IDENTIFY, r.N_MONEY, r.V_PERSON_NO, r.V_PERSON, r.V_DEPT, r.D_TIDAN_TIME, r.V_TIDAN_REN, r.V_REMARK, r.V_FIBER_INFO, r.D_SHOULI_TIME)
        length = len(reStr)
        if reStr[length-1] == ",":
            reStr = reStr[:length-1]
        return reStr + "]}"

    def login(self):
        p = web.input()
        p.V_PASSWORD = hashlib.md5(p.V_PASSWORD).hexdigest()
        results = self.db.query("select ID, V_USER_ID, V_TRUE_NAME, V_DEPT from tb_users where V_USER_ID='%s' and V_PASSWORD='%s'" % (p.V_USER_ID, p.V_PASSWORD))
        if len(results) > 0:
            for r in results:
                session.USER_FK = r.ID
                session.USER_ID = r.V_USER_ID
                session.TRUE_NAME = r.V_TRUE_NAME
                session.DEPT = r.V_DEPT
                    
            return '{success:true,V_TRUE_NAME:"%s"}' % session.TRUE_NAME
        else:
            return '{success:false,msg:"用户名或密码不正确！"}'
    
    def modifyPwd(self):
        p = web.input()
        p.V_OLD_PASSWORD = hashlib.md5(p.V_OLD_PASSWORD).hexdigest()
        p.V_NEW_PASSWORD = hashlib.md5(p.V_NEW_PASSWORD).hexdigest()
            
        results = self.db.query("select V_USER_ID from tb_users where V_USER_ID='%s' and V_PASSWORD='%s'" % (session.USER_ID, p.V_OLD_PASSWORD))
        if len(results) > 0:
            self.db.update("tb_users", where="V_USER_ID=$V_USER_ID and V_PASSWORD=$V_PASSWORD", vars={"V_USER_ID":session.USER_ID, "V_PASSWORD":p.V_OLD_PASSWORD}, V_PASSWORD=p.V_NEW_PASSWORD)
            return '{success:true}'
        else:
            return '{success:false,msg:"原密码不正确！"}'
    
    def addProj(self):
        p = web.input()
        results = self.db.query("select V_SERVICE_NUM from tb_projects where V_SERVICE_NUM='%s'" % p.V_SERVICE_NUM)
        if len(results) > 0:
            return '{success:false,msg:"\'%s\' %s"}' % (p.V_SERVICE_NUM, u"该业务号码已经存在！")
        else:
            ID = uuid.uuid1()
            currtime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.db.insert("tb_projects", ID=ID, V_SERVICE_NUM=p.V_SERVICE_NUM, V_ZONE=p.V_ZONE, V_CUST_NAME=p.V_CUST_NAME, V_PHONE=p.V_PHONE, V_ADDRESS=p.V_ADDRESS, V_IDENTIFY=p.V_IDENTIFY, N_MONEY=p.N_MONEY, V_PERSON_NO=p.V_PERSON_NO, V_PERSON=p.V_PERSON, V_DEPT=session.DEPT, D_TIDAN_TIME=currtime, V_TIDAN_REN=session.TRUE_NAME, V_REMARK=p.V_REMARK)
            return '{success:true,data:{ID_VIEW:"%s",V_SERVICE_NUM_VIEW:"%s",V_ZONE_VIEW:"%s",V_CUST_NAME_VIEW:"%s",V_PHONE_VIEW:"%s",V_ADDRESS_VIEW:"%s",V_IDENTIFY_VIEW:"%s",N_MONEY_VIEW:%s,V_PERSON_NO_VIEW:"%s",V_PERSON_VIEW:"%s",V_DEPT_VIEW:"%s",D_TIDAN_TIME_VIEW:"%s",V_TIDAN_REN_VIEW:"%s",V_REMARK_VIEW:"%s"}}' % (ID, p.V_SERVICE_NUM, p.V_ZONE, p.V_CUST_NAME, p.V_PHONE, p.V_ADDRESS, p.V_IDENTIFY, p.N_MONEY, p.V_PERSON_NO, p.V_PERSON, session.DEPT, currtime, session.TRUE_NAME, p.V_REMARK)
    
    def modifyProj(self):
        p = web.input()
        self.db.update("tb_projects", where="ID=$ID", vars={"ID":p.ID}, V_ZONE=p.V_ZONE, V_CUST_NAME=p.V_CUST_NAME, V_PHONE=p.V_PHONE, V_ADDRESS=p.V_ADDRESS, V_IDENTIFY=p.V_IDENTIFY, N_MONEY=p.N_MONEY, V_PERSON_NO=p.V_PERSON_NO, V_PERSON=p.V_PERSON, V_REMARK=p.V_REMARK, V_FIBER_INFO=p.V_FIBER_INFO, D_SHOULI_TIME=p.D_SHOULI_TIME)   
        results = self.db.select("tb_projects", what="V_SERVICE_NUM", where="ID=$ID", vars={"ID":p.ID})
        results = list(results)
        return '{success:true,data:{V_SERVICE_NUM_VIEW:"%s",V_ZONE_VIEW:"%s",V_CUST_NAME_VIEW:"%s",V_PHONE_VIEW:"%s",V_ADDRESS_VIEW:"%s",V_IDENTIFY_VIEW:"%s",N_MONEY_VIEW:%s,V_PERSON_NO_VIEW:"%s",V_PERSON_VIEW:"%s",V_DEPT_VIEW:"%s",V_REMARK_VIEW:"%s",V_FIBER_INFO_VIEW:"%s",D_SHOULI_TIME_VIEW:"%s"}}' % (results[0].V_SERVICE_NUM, p.V_ZONE, p.V_CUST_NAME, p.V_PHONE, p.V_ADDRESS, p.V_IDENTIFY, p.N_MONEY, p.V_PERSON_NO, p.V_PERSON, session.DEPT, p.V_REMARK, p.V_FIBER_INFO, p.D_SHOULI_TIME)
    
    def addUser(self):
        p = web.input()
        results = self.db.query("select V_USER_ID from tb_users where V_USER_ID='%s'" % p.V_USER_ID)
        if len(results) > 0:
            return '{success:false,msg:"\'%s\' %s"}' % (p.V_USER_ID, u"该用户已经存在！")
        else:
            ID = uuid.uuid1()
            password = hashlib.md5("111111").hexdigest()
            self.db.insert("tb_users", ID=ID, V_USER_ID=p.V_USER_ID, V_PASSWORD=password, V_TRUE_NAME=p.V_TRUE_NAME, V_DEPT=p.V_DEPT, V_MOBILE=p.V_MOBILE)
            return '{success:true,data:{ID_VIEW:"%s",V_USER_ID_VIEW:"%s",V_TRUE_NAME_VIEW:"%s",V_DEPT_VIEW:"%s",V_MOBILE_VIEW:"%s"}}' % (ID, p.V_USER_ID, p.V_TRUE_NAME, p.V_DEPT, p.V_MOBILE)
    
    def modifyUser(self):
        p = web.input()
        self.db.update("tb_users", where="ID=$ID", vars={"ID":p.ID}, V_TRUE_NAME=p.V_TRUE_NAME, V_DEPT=p.V_DEPT, V_MOBILE=p.V_MOBILE)
        results = self.db.select("tb_users", what="V_USER_ID", where="ID=$ID", vars={"ID":p.ID})
        results = list(results)
        return '{success:true,data:{V_USER_ID_VIEW:"%s",V_TRUE_NAME_VIEW:"%s",V_DEPT_VIEW:"%s",V_MOBILE_VIEW:"%s"}}' % (results[0].V_USER_ID, p.V_TRUE_NAME, p.V_DEPT, p.V_MOBILE)
    
    def loadProj(self):
        p = web.input()
        web.header("Content-type","text/html; charset=utf-8")
        reStr = "{success:true,data:["
        t = self.db.transaction()
        try:
            uploaded = p.V_ATTACH_FILE
            fname = uuid.uuid1()
            fname = "./uploads/%s.xls" % fname
            if uploaded:
                f = open(fname, "wb")
                f.write(uploaded)
                f.close()

            book = xlrd.open_workbook(fname)
            sheet = book.sheet_by_name("Sheet1")

            for i in range(1, sheet.nrows):
                if sheet.cell_type(i, 0) == 0: break
                V_SERVICE_NUM = long(sheet.cell_value(i, 0))
                V_ZONE = sheet.cell_value(i, 1).strip()
                results = self.db.query("select V_SERVICE_NUM from tb_projects where V_SERVICE_NUM='%s'" % V_SERVICE_NUM)
                zones = self.db.query("select V_ZONE from tb_zone where V_ZONE='%s'" % V_ZONE)
                if len(results) > 0 or len(str(V_SERVICE_NUM)) <> 8 or len(zones) == 0:
                    reStr += "{V_SERVICE_NUM_VIEW:'%s',V_ZONE_VIEW:'%s'}," % (V_SERVICE_NUM, V_ZONE)
                else:
                    ID = uuid.uuid1()
                    V_CUST_NAME = sheet.cell_value(i, 2).strip()
                    V_PHONE = sheet.cell_value(i, 3)
                    V_ADDRESS = sheet.cell_value(i, 4).strip()
                    V_IDENTIFY = sheet.cell_value(i, 5).strip()
                    try:
                        N_MONEY = float(sheet.cell_value(i, 6))
                    except:
                        N_MONEY = 0
                    V_PERSON_NO = sheet.cell_value(i, 7)
                    V_PERSON = sheet.cell_value(i, 8).strip()
                    V_DEPT = session.DEPT
                    D_TIDAN_TIME = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    V_TIDAN_REN = session.TRUE_NAME
                    V_REMARK = sheet.cell_value(i, 12).strip()
                    V_FIBER_INFO = sheet.cell_value(i, 13).strip()
                    if sheet.cell_type(i, 14) == 0:
                        D_SHOULI_TIME = None
                    else:
                        D_SHOULI_TIME = "'%s'" % sheet.cell_value(i, 14)
                    self.db.insert("tb_projects", ID=ID, V_SERVICE_NUM=V_SERVICE_NUM, V_ZONE=V_ZONE, V_CUST_NAME=V_CUST_NAME, V_PHONE=V_PHONE, V_ADDRESS=V_ADDRESS, V_IDENTIFY=V_IDENTIFY, N_MONEY=N_MONEY, V_PERSON_NO=V_PERSON_NO, V_PERSON=V_PERSON, V_DEPT=V_DEPT, D_TIDAN_TIME=D_TIDAN_TIME, V_TIDAN_REN=V_TIDAN_REN, V_REMARK=V_REMARK, V_FIBER_INFO=V_FIBER_INFO, D_SHOULI_TIME=D_SHOULI_TIME)
            t.commit()
            length = len(reStr)
            if reStr[length-1] == ",":
                reStr = reStr[:length-1]
            return reStr + "]}"
        except:
            t.rollback()
            return '{success:false}'
        finally:
            os.remove(fname)

    def exportProj(self):
        try:
            projFile = xlwt.Workbook()
            sheet = projFile.add_sheet("Sheet1")
        
            sheet.write(0, 0, u"业务号码")
            sheet.write(0, 1, u"小区名称")
            sheet.write(0, 2, u"客户姓名")
            sheet.write(0, 3, u"联系电话")
            sheet.write(0, 4, u"安装地址")
            sheet.write(0, 5, u"是否收身份证")
            sheet.write(0, 6, u"已收金额")
            sheet.write(0, 7, u"协揽工号")
            sheet.write(0, 8, u"协揽人")
            sheet.write(0, 9, u"协揽部门")
            sheet.write(0, 10, u"提单时间")
            sheet.write(0, 11, u"提单人")
            sheet.write(0, 12, u"备注")
            sheet.write(0, 13, u"工程布纤信息")
            sheet.write(0, 14, u"提交受理时间")
            excel_date_fmt = 'yyyy-m-d h:mm:ss'
            style = xlwt.XFStyle()
            style.num_format_str = excel_date_fmt
            i = 1
            for row in self.getProjs():
                sheet.write(i, 0, row.V_SERVICE_NUM)
                sheet.write(i, 1, row.V_ZONE)
                sheet.write(i, 2, row.V_CUST_NAME)
                sheet.write(i, 3, row.V_PHONE)
                sheet.write(i, 4, row.V_ADDRESS)
                sheet.write(i, 5, row.V_IDENTIFY)
                sheet.write(i, 6, row.N_MONEY)
                sheet.write(i, 7, row.V_PERSON_NO)
                sheet.write(i, 8, row.V_PERSON)
                sheet.write(i, 9, row.V_DEPT)
                sheet.write(i, 10, row.D_TIDAN_TIME, style)
                sheet.write(i, 11, row.V_TIDAN_REN)
                sheet.write(i, 12, row.V_REMARK)
                sheet.write(i, 13, row.V_FIBER_INFO)
                sheet.write(i, 14, row.D_SHOULI_TIME, style)
                i += 1
            
            fname = "./temp/%s.xls" % uuid.uuid1()
            projFile.save(fname)
            return '{success:true,url:".%s"}' % fname
        except:
            return '{success:false}'
        finally:
            now = time.time()
            xls = glob.glob("./temp/*.xls")
            for x in xls:
                info = os.stat(x)
                if now - info.st_ctime > 3600:
                    os.remove(x)
                                 
    def POST(self, action):
        if action == 'login':
            return self.login()
            
        elif action == "modifyPwd":
            return self.modifyPwd()
        
        elif action == "addProj":
            return self.addProj()
            
        elif action == "modifyProj":
            return self.modifyProj()
            
        elif action == "addUser":
            return self.addUser()
        
        elif action == "modifyUser":
            return self.modifyUser()
        
        elif action == "exportProj":
            return self.exportProj()
        
        elif action == "loadProj":
            return self.loadProj()
        else:
            return "Not found."
    
    def islogin(self):
        try:
            if session.USER_ID == "":
                return '{IS_LOGINED:false}'
            else:
                return '{IS_LOGINED:true,V_TRUE_NAME:"%s"}' % session.TRUE_NAME
        except AttributeError:
            return '{IS_LOGINED:false}'
    
    def logout(self):
        try:
            session.kill()
        except:
            return '{IS_LOGOUT:false}'
        else:
            return '{IS_LOGOUT:true}'
    
    def delProj(self):
        p = web.input()
        self.db.delete("tb_projects", where="ID=$ID", vars={"ID":p.ID})
    
    def delUser(self):
        p = web.input()
        self.db.delete("tb_users", where="ID=$ID", vars={"ID":p.ID})
        self.db.delete("tb_user_right_map", where="V_USER_FK=$V_USER_FK", vars={"V_USER_FK":p.ID})
    
    def resetPwd(self):
        p = web.input()
        password = hashlib.md5("111111").hexdigest()
        self.db.update("tb_users", where="ID=$ID", vars={"ID":p.ID}, V_PASSWORD=password)
    
    def getUsers(self):
        p = web.input()
            
        where = "V_USER_ID<>$V_USER_ID"
        params = {"V_USER_ID":"admin"}
                
        if hasattr(p, "V_TRUE_NAME") and p.V_TRUE_NAME <> "":
            where += " and V_TRUE_NAME=$V_TRUE_NAME"
            params["V_TRUE_NAME"] = p.V_TRUE_NAME
        if hasattr(p, "V_DEPT"):
            where += " and V_DEPT=$V_DEPT"
            params["V_DEPT"] = p.V_DEPT
                
        results = self.db.select("tb_users", where=where, vars=params)
        total = len(results)
            
        reStr = "{success:true,total:%s,data:[" % total
            
        if total > 0:
            offset = (int(p.page) - 1) * 25
            results = self.db.select("tb_users", where=where, vars=params, limit=p.limit, offset=offset)
            for r in results:
                reStr += "{ID_VIEW:'%s',V_USER_ID_VIEW:'%s',V_TRUE_NAME_VIEW:'%s',V_DEPT_VIEW:'%s',V_MOBILE_VIEW:'%s'}," % (r.ID, r.V_USER_ID, r.V_TRUE_NAME, r.V_DEPT, r.V_MOBILE)
        length = len(reStr)
        if reStr[length-1] == ",":
            reStr = reStr[:length-1]
        return reStr + "]}"
    
    def getRights(self):
        results = self.db.select("tb_right_info")
        reStr = "{success:true,total:%s,data:[" % len(results)
        for r in results:
            reStr += "{ID_VIEW:'%s',V_RIGHT_NAME_VIEW:'%s',V_RIGHT_DESC_VIEW:'%s',V_RIGHT_GROUP_VIEW:'%s'}," % (r.ID, r.V_RIGHT_NAME, r.V_RIGHT_DESC, r.V_RIGHT_GROUP)
        length = len(reStr)
        if reStr[length-1] == ",":
            reStr = reStr[:length-1]
        return reStr + "]}"
    
    def getUserRights(self):
        p = web.input()
            
        where = "tb_right_info.ID=tb_user_right_map.V_RIGHT_ID"
        params = {}
            
        if hasattr(p, "V_USER_FK") and p.V_USER_FK <> "":
            where += " and V_USER_FK=$V_USER_FK"
            params["V_USER_FK"] = p.V_USER_FK
        else:
            where += " and V_USER_FK=$V_USER_FK"
            params["V_USER_FK"] = ""
                
        results = self.db.select(["tb_user_right_map", "tb_right_info"], where=where, vars=params)
        total = len(results)
            
        reStr = "{success:true,total:%s,data:[" % total
            
        if total > 0:
            offset = (int(p.page) - 1) * 25
            results = self.db.select(["tb_user_right_map", "tb_right_info"], what="tb_user_right_map.ID as ID,V_RIGHT_NAME,V_RIGHT_DESC,V_RIGHT_GROUP", where=where, vars=params, limit=p.limit, offset=offset)
            for r in results:
                reStr += "{ID_VIEW:'%s',V_RIGHT_NAME_VIEW:'%s',V_RIGHT_DESC_VIEW:'%s',V_RIGHT_GROUP_VIEW:'%s'}," % (r.ID, r.V_RIGHT_NAME, r.V_RIGHT_DESC, r.V_RIGHT_GROUP)
        length = len(reStr)
        if reStr[length-1] == ",":
            reStr = reStr[:length-1]
        return reStr + "]}"
    
    def addRights(self):
        p = web.input()
        rightsId = json.loads(p.V_RIGHT_ID)
        for r in rightsId:
            results = self.db.select("tb_user_right_map", what="V_RIGHT_ID", where="V_RIGHT_ID=$V_RIGHT_ID and V_USER_FK=$V_USER_FK", vars={"V_RIGHT_ID":r, "V_USER_FK":p.V_USER_FK})
            if len(results) == 0:
                ID = uuid.uuid1()
                self.db.insert("tb_user_right_map", ID=ID, V_RIGHT_ID=r, V_USER_FK=p.V_USER_FK)
    
    def delUserRights(self):
        p = web.input()
        rightsId = json.loads(p.ID)
        for r in rightsId:
            self.db.delete("tb_user_right_map", where="ID=$ID", vars={"ID":r})
    
    def hasRights(self):
        p = web.input()
        results = self.db.select("tb_user_right_map", where="V_RIGHT_ID=$V_RIGHT_ID and V_USER_FK=$V_USER_FK", vars={"V_RIGHT_ID":p.ID, "V_USER_FK":session.USER_FK})
        if len(results) > 0:
            return "{success:true,bright:true}"
        else:
            return "{success:true,bright:false}"
    
    def getZone(self):
        p = web.input()
        params = {}
        reStr = "["
        if hasattr(p, "V_ZONE") and p.V_ZONE <> "":
            where = "V_ZONE like $V_ZONE"
            params["V_ZONE"] = '%' + p.V_ZONE + '%'
            results = self.db.select("tb_zone", what="V_ZONE", where=where, vars=params)
            for r in results:
                reStr += "['%s']," % r.V_ZONE
            length = len(reStr)
            if reStr[length-1] == ",":
                reStr = reStr[:length-1]
        return reStr + "]"
                                               
    def GET(self, action):
        
        if action == "islogin":
            return self.islogin()
                    
        elif action == "logout":
            return self.logout()
        
        elif action == "getProj":
            return self.getProjs()
        
        elif action == "getZone":
            return self.getZone()
        
        elif action == "delProj":
            return self.delProj()
        
        elif action == "delUser":
            return self.delUser()
        
        elif action == "resetPwd":
            return self.resetPwd()
            
        elif action == "getUsers":
            return self.getUsers()
        
        elif action == "getRights":
            return self.getRights()
        
        elif action == "getUserRights":
            return self.getUserRights()
        
        elif action == "addRights":
            return self.addRights()
        
        elif action == "delUserRights":
            return self.delUserRights()
                
        if action == "hasRights":
            return self.hasRights()
        else:
            return "Not found."
 
if __name__ == '__main__':
    app.run()

#application = app.wsgifunc()
