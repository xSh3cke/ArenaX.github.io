const {test}=require('node:test');
const assert=require('node:assert/strict');
const api=require('../discord-stats.js');
const guildId='1549515247612592378';
const invite=(total,online,id=guildId)=>({guild:{id,name:'ARENA X'},approximate_member_count:total,approximate_presence_count:online});
test('Calcula offline usando los dos contadores públicos del mismo servidor',()=>{
  assert.equal(typeof api.fromInvite,'function');
  assert.deepEqual(api.fromInvite(invite(24,7),guildId),{total:24,online:7,offline:17,approximate:true,source:'invite',name:'ARENA X'});
});
test('Cero miembros en línea es un dato válido',()=>{
  assert.equal(typeof api.fromInvite,'function');
  assert.equal(api.fromInvite(invite(4,0),guildId).offline,4);
});
test('No publica cifras de otra comunidad',()=>{
  assert.equal(typeof api.fromInvite,'function');
  assert.throws(()=>api.fromInvite(invite(24,7,'100000000000000001'),guildId));
});
test('No inventa cero offline cuando falta el total o los datos son inconsistentes',()=>{
  assert.equal(typeof api.fromInvite,'function');
  for(const data of [invite(undefined,4),invite(3,8),invite(-1,0),invite(10,'2')]) assert.throws(()=>api.fromInvite(data,guildId));
});
test('El widget solo aporta online; no deduce miembros totales de su lista limitada',()=>{
  assert.equal(typeof api.fromWidget,'function');
  assert.deepEqual(api.fromWidget({id:guildId,name:'ARENA X',presence_count:101,members:[]},guildId),{total:null,online:101,offline:null,approximate:false,source:'widget',name:'ARENA X'});
});
test('Usa la invitación con with_counts y sin credenciales',async()=>{
  assert.equal(typeof api.fetchStats,'function');
  const calls=[];
  const data=await api.fetchStats({guildId,inviteCode:'4JzWcYacKF'},async(url,options)=>{
    calls.push({url,options});return {ok:true,json:async()=>invite(4,0)};
  });
  assert.equal(data.offline,4);assert.equal(calls.length,1);
  assert.match(calls[0].url,/invites\/4JzWcYacKF\?with_counts=true$/);
  assert.equal(calls[0].options.credentials,'omit');
});
test('Si la invitación falla, usa el widget del ID correcto',async()=>{
  assert.equal(typeof api.fetchStats,'function');
  let calls=0;
  const data=await api.fetchStats({guildId,inviteCode:'4JzWcYacKF'},async()=>++calls===1?{ok:false,status:404,headers:{get:()=>null}}:{ok:true,json:async()=>({id:guildId,name:'ARENA X',presence_count:2})});
  assert.equal(calls,2);assert.equal(data.online,2);assert.equal(data.offline,null);
});
test('Una respuesta 429 respeta Retry-After y evita otra solicitud inmediata',async()=>{
  assert.equal(typeof api.fetchStats,'function');let calls=0;
  await assert.rejects(()=>api.fetchStats({guildId,inviteCode:'4JzWcYacKF'},async()=>{calls++;return {ok:false,status:429,headers:{get:()=> '180'}}}),e=>e.retryAfterMs===180000);
  assert.equal(calls,1);
});
